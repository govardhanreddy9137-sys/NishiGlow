import cookieParser from 'cookie-parser';
import cors from 'cors';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const SESSION_COOKIE = 'nishiglow_session';
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;
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
  phone: { type: String, default: '' },
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

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
const OrderModel = mongoose.models.StudioOrder || mongoose.model('StudioOrder', OrderSchema);

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

const getAdminEmails = () => new Set(['nishiglowstudio@gmail.com']);

const isValidEmail = (email) =>
  typeof email === 'string'
  && email.length <= 254
  && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizePhone = phone => typeof phone === 'string' && /^[+\d\s().-]+$/.test(phone.trim())
  ? phone.trim().replace(/[^\d+]/g, '')
  : '';

const isValidPhone = phone => /^\+?\d{7,15}$/.test(phone);

const isValidPassword = password =>
  typeof password === 'string'
  && password.length >= MIN_PASSWORD_LENGTH
  && password.length <= 128;

const hashPassword = async password => {
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
    authenticationConfigured: Boolean(
      process.env.SESSION_SECRET?.length >= 32 && process.env.ADMIN_PASSWORD_HASH
    ),
    databaseConnected: isMongoConnected
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

app.post('/api/auth/register', passwordLoginLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const phone = normalizePhone(req.body?.phone);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const passwordConfirmation = typeof req.body?.passwordConfirmation === 'string'
    ? req.body.passwordConfirmation
    : '';
  const serviceInterest = typeof req.body?.serviceInterest === 'string'
    ? req.body.serviceInterest.trim().slice(0, 120)
    : '';

  if (!isValidEmail(email) || !isValidPhone(phone) || !isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: `Enter a valid email, phone number, and password between ${MIN_PASSWORD_LENGTH} and 128 characters.`
    });
  }
  if (password !== passwordConfirmation) {
    return res.status(400).json({ success: false, message: 'The passwords do not match.' });
  }
  if (getAdminEmails().has(email)) {
    return res.status(403).json({ success: false, message: 'Use the studio admin sign-in for this email address.' });
  }
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return res.status(503).json({ success: false, message: 'Sign-in is temporarily unavailable. Please try again later.' });
  }
  if (!isMongoConnected) {
    return res.status(503).json({ success: false, message: 'Account storage is unavailable. Please try again later.' });
  }

  try {
    const existingUser = await UserModel.findOne({ email }).select('+passwordHash');
    const userUpdates = {
      name: existingUser?.name || email.split('@')[0],
      role: 'Client',
      phone,
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
    return res.status(201).json({ success: true, isNewUser: !existingUser, user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
    }
    console.error('[Customer Registration] Could not create account:', error.message);
    return res.status(500).json({ success: false, message: 'Could not create your account. Please try again.' });
  }
});

app.post('/api/auth/login', passwordLoginLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const phone = normalizePhone(req.body?.phone);
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

    if (!isValidPhone(phone)) {
      return res.status(400).json({ success: false, message: 'Customers must enter the phone number used when creating their account.' });
    }

    const user = await UserModel.findOne({ email }).select('+passwordHash');
    const passwordMatches = user?.passwordHash
      ? await verifyPassword(password, user.passwordHash)
      : false;
    if (!user?.passwordHash || user.phone !== phone || !passwordMatches) {
      return res.status(401).json({ success: false, message: 'Email, phone number, or password is incorrect. New customers should create an account.' });
    }

    user.role = 'Client';
    user.lastLoginAt = new Date();
    await user.save();
    issueSession(res, user);
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error('[Password Login] Sign-in failed:', error.message);
    return res.status(500).json({ success: false, message: 'Could not sign in. Please try again.' });
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
    const email = typeof session.email === 'string' ? session.email.toLowerCase() : '';
    if (session.role === 'Admin' && !getAdminEmails().has(email)) {
      res.clearCookie(SESSION_COOKIE, getSessionCookieOptions());
      return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
    }
    return res.json({
      success: true,
      user: {
        email,
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

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

let initialization;
export const initializeServer = () => {
  if (!initialization) {
    initialization = (async () => {
      if (process.env.NODE_ENV === 'production') {
        const missingSettings = [
          (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) && 'SESSION_SECRET (at least 32 characters)',
          !process.env.ADMIN_PASSWORD_HASH && 'ADMIN_PASSWORD_HASH',
          !process.env.MONGODB_URI && 'MONGODB_URI'
        ].filter(Boolean);

        if (missingSettings.length) {
          throw new Error(`Missing production configuration: ${missingSettings.join(', ')}`);
        }
        await connectDatabase();
      } else if (process.env.MONGODB_URI) {
        connectDatabase().catch((error) => {
          console.error('[MongoDB] Connection failed:', error.message);
        });
      }
    })().catch((error) => {
      initialization = undefined;
      throw error;
    });
  }
  return initialization;
};

export { app };

const startServer = async () => {
  await initializeServer();
  app.listen(PORT, () => {
    console.log(`NISHIGLOWSTUDIO server listening on port ${PORT}`);
  });
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startServer().catch((error) => {
    console.error('[Server] Startup failed:', error.message);
    process.exitCode = 1;
  });
}
