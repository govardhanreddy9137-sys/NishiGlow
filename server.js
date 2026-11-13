import cookieParser from 'cookie-parser';
import cors from 'cors';
import { randomInt, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const SESSION_COOKIE = 'nishiglow_session';
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;
const OTP_DURATION_MS = 10 * 60 * 1000;
const OTP_RESEND_WAIT_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const MIN_PASSWORD_LENGTH = 12;
const scryptAsync = promisify(scrypt);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const allowedOrigins = (process.env.APP_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());

let isMongoConnected = false;
let isSmtpConnected = false;
const connectDatabase = () => mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  isMongoConnected = true;
  console.log('[MongoDB] Connected');
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  picture: { type: String, default: '' },
  role: { type: String, enum: ['Client', 'Admin'], default: 'Client' },
  serviceInterest: { type: String, default: '' },
  passwordHash: { type: String, select: false },
  lastLoginAt: { type: Date, default: Date.now }
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, lowercase: true, trim: true },
  service: { type: String, required: true, trim: true },
  plan: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Completed', 'In Progress', 'Pending'], default: 'Pending' },
  date: { type: String, required: true },
  paymentMethod: { type: String, default: 'Not recorded' }
}, { timestamps: true });

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, required: true }
});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
const OtpModel = mongoose.models.EmailOtp || mongoose.model('EmailOtp', OtpSchema);
const OrderModel = mongoose.models.StudioOrder || mongoose.model('StudioOrder', OrderSchema);

const mailer = process.env.GMAIL_USER && process.env.GMAIL_PASS
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000
    })
  : null;

const requestOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many code requests. Please try again later.' }
});

const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many code attempts. Please try again later.' }
});

const passwordLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts. Please try again later.' }
});

const getSessionCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: SESSION_DURATION_SECONDS * 1000,
  path: '/'
});

const getOtpHash = (email, code) => createHmac('sha256', process.env.SESSION_SECRET)
  .update(`${email}:${code}`)
  .digest('hex');

const getAdminEmails = () => new Set(
  [
    process.env.ADMIN_EMAILS,
    process.env.ADMIN_EMAIL,
    'nishiglowstudio@gmail.com,nishitanishi045@gmail.com,nishita@gmail.com'
  ]
    .filter(Boolean)
    .join(',')
    .split(',')
    .map(address => address.trim().toLowerCase())
    .filter(Boolean)
);

const isValidEmail = (email) =>
  typeof email === 'string'
  && email.length <= 254
  && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) =>
  typeof password === 'string'
  && password.length >= MIN_PASSWORD_LENGTH
  && password.length <= 128;

const hashPassword = async (password) => {
  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;
};

const verifyPassword = async (password, passwordHash) => {
  const [algorithm, saltValue, keyValue] = passwordHash.split('$');
  if (algorithm !== 'scrypt' || !saltValue || !keyValue) return false;

  const salt = Buffer.from(saltValue, 'base64url');
  const expectedKey = Buffer.from(keyValue, 'base64url');
  const actualKey = await scryptAsync(password, salt, expectedKey.length);
  return expectedKey.length > 0
    && actualKey.length === expectedKey.length
    && timingSafeEqual(expectedKey, actualKey);
};

const authConfigurationMissing = () => (
  !mailer
  || !process.env.GMAIL_USER
  || !process.env.GMAIL_PASS
  || !process.env.SESSION_SECRET
  || process.env.SESSION_SECRET.length < 32
);

const issueSession = (res, user) => {
  const sessionToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role
    },
    process.env.SESSION_SECRET,
    { algorithm: 'HS256', expiresIn: SESSION_DURATION_SECONDS, issuer: 'nishiglowstudio' }
  );
  res.cookie(SESSION_COOKIE, sessionToken, getSessionCookieOptions());
};

const publicUser = user => ({
  email: user.email,
  name: user.name,
  picture: user.picture,
  role: user.role,
  isAdmin: user.role === 'Admin'
});

const requireAdmin = (req, res, next) => {
  const token = req.cookies[SESSION_COOKIE];
  if (!token || !process.env.SESSION_SECRET) {
    return res.status(401).json({ success: false, message: 'Admin sign-in is required.' });
  }

  try {
    const session = jwt.verify(token, process.env.SESSION_SECRET, {
      algorithms: ['HS256'],
      issuer: 'nishiglowstudio'
    });
    const email = typeof session.email === 'string' ? session.email.toLowerCase() : '';
    if (session.role !== 'Admin' || !getAdminEmails().has(email)) {
      return res.status(403).json({ success: false, message: 'Admin permission is required.' });
    }
    req.adminEmail = email;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Admin session expired. Please sign in again.' });
  }
};

const publicOrder = order => ({
  id: order.id,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  service: order.service,
  plan: order.plan,
  amount: order.amount,
  status: order.status,
  date: order.date,
  paymentMethod: order.paymentMethod
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    emailOtpConfigured: Boolean(mailer && process.env.SESSION_SECRET?.length >= 32),
    databaseConnected: isMongoConnected,
    smtpConnected: isSmtpConnected
  });
});

app.get('/api/admin/members', requireAdmin, async (_req, res) => {
  if (!isMongoConnected) {
    return res.status(503).json({ success: false, message: 'Account storage is unavailable.' });
  }
  try {
    const members = await UserModel.find({ role: 'Client' })
      .select('name email serviceInterest createdAt lastLoginAt')
      .sort({ createdAt: -1 })
      .lean();
    return res.json({
      success: true,
      members: members.map(member => ({
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        serviceInterest: member.serviceInterest || '',
        registeredAt: member.createdAt,
        lastLoginAt: member.lastLoginAt
      }))
    });
  } catch (error) {
    console.error('[Admin] Could not load members:', error.message);
    return res.status(500).json({ success: false, message: 'Could not load customer accounts.' });
  }
});

app.patch('/api/admin/members/:id', requireAdmin, async (req, res) => {
  if (!isMongoConnected) {
    return res.status(503).json({ success: false, message: 'Account storage is unavailable.' });
  }
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const serviceInterest = typeof req.body?.serviceInterest === 'string'
    ? req.body.serviceInterest.trim().slice(0, 120)
    : '';
  if (!name || name.length > 120) {
    return res.status(400).json({ success: false, message: 'Enter a customer name up to 120 characters.' });
  }
  try {
    const member = await UserModel.findOneAndUpdate(
      { _id: req.params.id, role: 'Client' },
      { $set: { name, serviceInterest } },
      { new: true, runValidators: true }
    ).select('name email serviceInterest createdAt lastLoginAt');
    if (!member) return res.status(404).json({ success: false, message: 'Customer account not found.' });
    return res.json({
      success: true,
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        serviceInterest: member.serviceInterest || '',
        registeredAt: member.createdAt,
        lastLoginAt: member.lastLoginAt
      }
    });
  } catch (error) {
    console.error('[Admin] Could not update member:', error.message);
    return res.status(500).json({ success: false, message: 'Could not update customer account.' });
  }
});

app.delete('/api/admin/members/:id', requireAdmin, async (req, res) => {
  if (!isMongoConnected) {
    return res.status(503).json({ success: false, message: 'Account storage is unavailable.' });
  }
  try {
    const result = await UserModel.deleteOne({ _id: req.params.id, role: 'Client' });
    if (!result.deletedCount) return res.status(404).json({ success: false, message: 'Customer account not found.' });
    return res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Could not delete member:', error.message);
    return res.status(500).json({ success: false, message: 'Could not delete customer account.' });
  }
});

app.get('/api/admin/orders', requireAdmin, async (_req, res) => {
  if (!isMongoConnected) {
    return res.status(503).json({ success: false, message: 'Account storage is unavailable.' });
  }
  try {
    const orders = await OrderModel.find().sort({ date: -1, createdAt: -1 }).lean();
    return res.json({ success: true, orders: orders.map(publicOrder) });
  } catch (error) {
    console.error('[Admin] Could not load orders:', error.message);
    return res.status(500).json({ success: false, message: 'Could not load order records.' });
  }
});

app.post('/api/admin/orders', requireAdmin, async (req, res) => {
  const orderData = req.body || {};
  const customerName = typeof orderData.customerName === 'string' ? orderData.customerName.trim() : '';
  const customerEmail = typeof orderData.customerEmail === 'string' ? orderData.customerEmail.trim().toLowerCase() : '';
  const service = typeof orderData.service === 'string' ? orderData.service.trim() : '';
  const plan = typeof orderData.plan === 'string' ? orderData.plan.trim() : '';
  const amount = Number(orderData.amount);
  if (!customerName || customerName.length > 120 || !isValidEmail(customerEmail)
      || !service || service.length > 120 || !plan || plan.length > 160
      || !Number.isFinite(amount) || amount < 0 || amount > 100000000) {
    return res.status(400).json({ success: false, message: 'Enter valid customer, service, plan, and amount details.' });
  }
  try {
    const order = await OrderModel.create({
      id: `ORD-${randomBytes(5).toString('hex').toUpperCase()}`,
      customerName,
      customerEmail,
      service,
      plan,
      amount,
      status: ['Completed', 'In Progress', 'Pending'].includes(orderData.status) ? orderData.status : 'Pending',
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: typeof orderData.paymentMethod === 'string' ? orderData.paymentMethod.trim().slice(0, 80) : 'Not recorded'
    });
    return res.status(201).json({ success: true, order: publicOrder(order) });
  } catch (error) {
    console.error('[Admin] Could not create order:', error.message);
    return res.status(500).json({ success: false, message: 'Could not create order record.' });
  }
});

app.patch('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  const updates = {};
  if (typeof req.body?.customerName === 'string') updates.customerName = req.body.customerName.trim();
  if (typeof req.body?.customerEmail === 'string') updates.customerEmail = req.body.customerEmail.trim().toLowerCase();
  if (typeof req.body?.service === 'string') updates.service = req.body.service.trim();
  if (typeof req.body?.plan === 'string') updates.plan = req.body.plan.trim();
  if (req.body?.amount !== undefined) updates.amount = Number(req.body.amount);
  if (typeof req.body?.status === 'string') updates.status = req.body.status;
  if (typeof req.body?.paymentMethod === 'string') updates.paymentMethod = req.body.paymentMethod.trim();
  if (!Object.keys(updates).length
      || (updates.customerName !== undefined && (!updates.customerName || updates.customerName.length > 120))
      || (updates.customerEmail && !isValidEmail(updates.customerEmail))
      || (updates.service !== undefined && (!updates.service || updates.service.length > 120))
      || (updates.plan !== undefined && (!updates.plan || updates.plan.length > 160))
      || (updates.paymentMethod !== undefined && updates.paymentMethod.length > 80)
      || (updates.amount !== undefined && (!Number.isFinite(updates.amount) || updates.amount < 0))
      || (updates.status && !['Completed', 'In Progress', 'Pending'].includes(updates.status))) {
    return res.status(400).json({ success: false, message: 'Enter valid order details.' });
  }
  try {
    const order = await OrderModel.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    return res.json({ success: true, order: publicOrder(order) });
  } catch (error) {
    console.error('[Admin] Could not update order:', error.message);
    return res.status(500).json({ success: false, message: 'Could not update order record.' });
  }
});

app.delete('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  try {
    const result = await OrderModel.deleteOne({ id: req.params.id });
    if (!result.deletedCount) return res.status(404).json({ success: false, message: 'Order not found.' });
    return res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Could not delete order:', error.message);
    return res.status(500).json({ success: false, message: 'Could not delete order record.' });
  }
});

app.post('/api/auth/otp/request', requestOtpLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  }
  if (authConfigurationMissing()) {
    return res.status(503).json({
      success: false,
      message: 'Email sign-in is not configured. Add the Gmail App Password to GMAIL_PASS in .env, then restart the backend.'
    });
  }
  if (!isMongoConnected) {
    return res.status(503).json({ success: false, message: 'Account storage is unavailable. Please try again later.' });
  }

  try {
    const previousOtp = await OtpModel.findOne({ email });
    const waitRemaining = previousOtp
      ? OTP_RESEND_WAIT_MS - (Date.now() - previousOtp.lastSentAt.getTime())
      : 0;
    if (waitRemaining > 0) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${Math.ceil(waitRemaining / 1000)} seconds before requesting another code.`
      });
    }

    const code = randomInt(0, 1000000).toString().padStart(6, '0');
    const sentAt = new Date();
    await OtpModel.findOneAndUpdate(
      { email },
      {
        email,
        codeHash: getOtpHash(email, code),
        expiresAt: new Date(sentAt.getTime() + OTP_DURATION_MS),
        attempts: 0,
        lastSentAt: sentAt
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    try {
      await mailer.sendMail({
        from: `"NISHIGLOWSTUDIO" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your NISHIGLOWSTUDIO password setup code',
        text: `Your verification code is ${code}. It expires in 10 minutes. Use it to set or reset your website password. If you did not request this code, you can ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#1f2937"><h2 style="color:#7c3aed">NISHIGLOWSTUDIO</h2><p>Use this one-time code to set or reset your website password:</p><p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#7c3aed">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`
      });
      isSmtpConnected = true;
    } catch (error) {
      await OtpModel.deleteOne({ email, codeHash: getOtpHash(email, code) });
      console.error('[Email OTP] Gmail delivery failed:', error.message);
      return res.status(503).json({
        success: false,
        message: 'We could not send the verification email. Check the studio Gmail App Password and try again.'
      });
    }

    return res.json({
      success: true,
      message: 'If this address can receive email, a verification code is on its way.'
    });
  } catch (error) {
    console.error('[Email OTP] Could not create code:', error.message);
    return res.status(500).json({ success: false, message: 'Could not start email verification. Please try again.' });
  }
});

app.post('/api/auth/login', passwordLoginLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!isValidEmail(email) || password.length === 0 || password.length > 128) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address and password.' });
  }
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return res.status(503).json({ success: false, message: 'Sign-in is temporarily unavailable. Please try again later.' });
  }
  if (!isMongoConnected) {
    return res.status(503).json({ success: false, message: 'Account storage is unavailable. Please try again later.' });
  }

  try {
    if (getAdminEmails().has(email)) {
      if (!process.env.ADMIN_PASSWORD_HASH) {
        return res.status(503).json({
          success: false,
          message: 'Admin password is not configured. Run `npm run admin:set-password` in the project terminal, then restart the backend.'
        });
      }
      if (!(await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH))) {
        return res.status(401).json({ success: false, message: 'Admin email or password is incorrect.' });
      }

      const adminUser = {
        id: `admin:${email}`,
        email,
        name: email.split('@')[0],
        picture: '',
        role: 'Admin'
      };
      issueSession(res, adminUser);
      return res.json({ success: true, user: publicUser(adminUser) });
    }

    const user = await UserModel.findOne({ email }).select('+passwordHash');
    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect. If this is an older account, use “Create account / Forgot password” to verify your email and set a password.' });
    }

    user.role = getAdminEmails().has(email) ? 'Admin' : 'Client';
    user.lastLoginAt = new Date();
    await user.save();
    issueSession(res, user);
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error('[Password Login] Sign-in failed:', error.message);
    return res.status(500).json({ success: false, message: 'Could not sign in. Please try again.' });
  }
});

app.post('/api/auth/otp/verify', verifyOtpLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
  const password = req.body?.password;
  const passwordConfirmation = req.body?.passwordConfirmation;
  const serviceInterest = typeof req.body?.serviceInterest === 'string'
    ? req.body.serviceInterest.trim().slice(0, 120)
    : '';

  if (!isValidEmail(email) || !/^\d{6}$/.test(code) || !isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: `Enter the email, six-digit code, and a password between ${MIN_PASSWORD_LENGTH} and 128 characters.`
    });
  }
  if (password !== passwordConfirmation) {
    return res.status(400).json({ success: false, message: 'The passwords do not match.' });
  }
  if (authConfigurationMissing()) {
    return res.status(503).json({ success: false, message: 'Email sign-in is not configured on the server.' });
  }
  if (!isMongoConnected) {
    return res.status(503).json({ success: false, message: 'Account storage is unavailable. Please try again later.' });
  }

  try {
    const otp = await OtpModel.findOne({ email });
    if (!otp || otp.expiresAt.getTime() <= Date.now() || otp.attempts >= MAX_OTP_ATTEMPTS) {
      if (otp && (otp.expiresAt.getTime() <= Date.now() || otp.attempts >= MAX_OTP_ATTEMPTS)) {
        await OtpModel.deleteOne({ _id: otp._id });
      }
      return res.status(400).json({ success: false, message: 'That code is invalid or expired. Request a new code.' });
    }

    const expectedHash = Buffer.from(otp.codeHash, 'hex');
    const providedHash = Buffer.from(getOtpHash(email, code), 'hex');
    if (expectedHash.length !== providedHash.length || !timingSafeEqual(expectedHash, providedHash)) {
      otp.attempts += 1;
      await otp.save();
      return res.status(400).json({
        success: false,
        message: `Incorrect code. ${MAX_OTP_ATTEMPTS - otp.attempts} attempt(s) remaining.`
      });
    }

    await OtpModel.deleteOne({ _id: otp._id });
    const role = getAdminEmails().has(email) ? 'Admin' : 'Client';
    const existingUser = await UserModel.findOne({ email });
    const userUpdates = {
      name: existingUser?.name || email.split('@')[0],
      role,
      passwordHash: await hashPassword(password),
      lastLoginAt: new Date()
    };
    if (serviceInterest) userUpdates.serviceInterest = serviceInterest;
    const user = await UserModel.findOneAndUpdate(
      { email },
      { $set: userUpdates },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    issueSession(res, user);
    return res.json({ success: true, isNewUser: !existingUser, user: publicUser(user) });
  } catch (error) {
    console.error('[Email OTP] Verification failed:', error.message);
    return res.status(500).json({ success: false, message: 'Could not verify the code. Please try again.' });
  }
});

app.get('/api/auth/session', (req, res) => {
  const sessionSecret = process.env.SESSION_SECRET;
  const token = req.cookies[SESSION_COOKIE];
  if (!sessionSecret || !token) {
    return res.status(401).json({ success: false, message: 'No active session.' });
  }

  try {
    const session = jwt.verify(token, sessionSecret, {
      algorithms: ['HS256'],
      issuer: 'nishiglowstudio'
    });
    return res.json({
      success: true,
      user: {
        email: session.email,
        name: session.name,
        picture: session.picture,
        role: session.role,
        isAdmin: session.role === 'Admin'
      }
    });
  } catch {
    res.clearCookie(SESSION_COOKIE, getSessionCookieOptions());
    return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, getSessionCookieOptions());
  res.json({ success: true });
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

const startServer = async () => {
  if (process.env.NODE_ENV === 'production') {
    const missingSettings = [
      !process.env.GMAIL_USER && 'GMAIL_USER',
      !process.env.GMAIL_PASS && 'GMAIL_PASS (Google App Password)',
      (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) && 'SESSION_SECRET (at least 32 characters)',
      !process.env.MONGODB_URI && 'MONGODB_URI'
    ].filter(Boolean);

    if (missingSettings.length) {
      throw new Error(`Missing production configuration: ${missingSettings.join(', ')}`);
    }
    await connectDatabase();
    await mailer.verify();
    isSmtpConnected = true;
  } else if (process.env.MONGODB_URI) {
    connectDatabase().catch((error) => {
      console.error('[MongoDB] Connection failed:', error.message);
    });
  }

  if (process.env.NODE_ENV !== 'production' && mailer) {
    mailer.verify().then(() => {
      isSmtpConnected = true;
      console.log('[Gmail SMTP] Connected');
    }).catch((error) => {
      console.error('[Gmail SMTP] Connection failed:', error.message);
    });
  }

  app.listen(PORT, () => {
    console.log(`NISHIGLOWSTUDIO server listening on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('[Server] Startup failed:', error.message);
  process.exitCode = 1;
});
