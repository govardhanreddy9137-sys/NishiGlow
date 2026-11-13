import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, AlertCircle, Loader2, Sparkles, ShieldCheck, ArrowLeft, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { authApiUrl } from '../authApi';
import { SERVICES } from '../data/siteData';

async function postAuthRequest(path, body) {
  let response;
  try {
    response = await fetch(authApiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });
  } catch {
    throw new Error('Can’t reach the sign-in server. Start it with `npm run server` and try again.');
  }

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    throw new Error('The sign-in server returned an invalid response. Restart it with `npm run server` and try again.');
  }

  if (!data || typeof data !== 'object') {
    throw new Error('The sign-in server returned an empty response. Start it with `npm run server` and try again.');
  }
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Sign-in request failed (HTTP ${response.status}).`);
  }
  return data;
}

export default function AuthModal({ onSuccessNavigate }) {
  const { isAuthModalOpen, closeAuthModal, login, loginAdmin } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [serviceInterest, setServiceInterest] = useState('');
  const [code, setCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
    setShowPassword(false);
    setShowPasswordConfirmation(false);
    setServiceInterest('');
    setCode('');
    setOtpSent(false);
    setMode('login');
    setLoading(false);
    setErrorMsg('');
    setInfoMsg('');
    closeAuthModal();
  };

  const finishLogin = (user) => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    if (user.isAdmin) {
      loginAdmin(user);
      onSuccessNavigate?.('admin');
    } else {
      login(user);
    }
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
    setShowPassword(false);
    setShowPasswordConfirmation(false);
    setCode('');
    setOtpSent(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      const data = await postAuthRequest('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password
      });
      finishLogin(data.user);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      const data = await postAuthRequest('/api/auth/otp/request', {
        email: email.trim().toLowerCase()
      });
      setOtpSent(true);
      setInfoMsg(data.message);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Could not send the verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    if (password !== passwordConfirmation) {
      setErrorMsg('The passwords do not match.');
      return;
    }
    setLoading(true);

    try {
      const data = await postAuthRequest('/api/auth/otp/verify', {
        email: email.trim().toLowerCase(),
        code: code.trim(),
        password,
        passwordConfirmation,
        serviceInterest
      });
      finishLogin(data.user);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Could not verify the code.');
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setPassword('');
    setPasswordConfirmation('');
    setShowPassword(false);
    setShowPasswordConfirmation(false);
    setServiceInterest('');
    setCode('');
    setOtpSent(false);
    setErrorMsg('');
    setInfoMsg('');
  };

  const changeEmail = () => {
    setOtpSent(false);
    setCode('');
    setErrorMsg('');
    setInfoMsg('');
  };

  const inputClass = 'w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all';
  const buttonClass = 'w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50';
  const isSetupMode = mode === 'setup';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0b0e1b]/95 border border-purple-500/30 p-7 sm:p-8 shadow-2xl shadow-purple-950/60 backdrop-blur-2xl">
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-purple-600/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-pink-600/25 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={resetForm}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900/60 hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close sign-in"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-3 shadow-lg shadow-purple-500/30 mb-3">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
            {isSetupMode ? (otpSent ? 'Set your password' : 'Create or reset password') : 'Sign in'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {isSetupMode
              ? otpSent
                ? `Enter the code sent to ${email}, then choose a password.`
                : 'Verify your email with a one-time code to create an account or reset your password.'
              : 'Admin: sign in directly with the configured studio email and password. Customers: use your account email and password.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 shadow-lg shadow-red-950/40">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm">
            {infoMsg}
          </div>
        )}

        {!isSetupMode ? (
          <form onSubmit={handleLogin} className="relative z-10 space-y-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email address
              <span className="relative block mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoFocus
                  autoComplete="email"
                  maxLength={254}
                  className={`${inputClass} pl-10`}
                />
              </span>
            </label>

            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
              <span className="relative block mt-1.5">
                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  maxLength={128}
                  className={`${inputClass} pl-10 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>

            <button type="submit" disabled={loading} className={buttonClass}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in…</span></>
              ) : (
                <><ShieldCheck className="w-4 h-4" /><span>Sign in</span></>
              )}
            </button>
            <button
              type="button"
              onClick={() => changeMode('setup')}
              className="w-full text-xs text-purple-300 hover:text-white"
            >
              First sign-in? Create account / Forgot password
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-500">
              Verify your email and set a website password once. After that, sign in directly with your email and password.
            </p>
          </form>
        ) : !otpSent ? (
          <form onSubmit={handleRequestCode} className="relative z-10 space-y-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email address
              <span className="relative block mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoFocus
                  autoComplete="email"
                  maxLength={254}
                  className={`${inputClass} pl-10`}
                />
              </span>
            </label>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Service you’re interested in (optional)
              <select
                value={serviceInterest}
                onChange={(e) => setServiceInterest(e.target.value)}
                className={`${inputClass} mt-1.5`}
              >
                <option value="">Not sure yet</option>
                {SERVICES.map((service) => (
                  <option key={service.id} value={service.title}>{service.title}</option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={loading} className={buttonClass}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending verification code…</span></>
              ) : (
                <><Mail className="w-4 h-4" /><span>Send email verification code</span></>
              )}
            </button>
            <button
              type="button"
              onClick={() => changeMode('login')}
              className="w-full text-xs text-slate-400 hover:text-white"
            >
              <span className="inline-flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Back to sign in</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSetPassword} className="relative z-10 space-y-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Six-digit verification code
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                required
                autoFocus
                className={`${inputClass} mt-1.5 text-center text-xl tracking-[0.5em] placeholder-slate-600`}
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Create password (12 characters minimum)
              <span className="relative mt-1.5 block">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  minLength={12}
                  maxLength={128}
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Re-enter password
              <span className="relative mt-1.5 block">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  minLength={12}
                  maxLength={128}
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation((visible) => !visible)}
                  aria-label={showPasswordConfirmation ? 'Hide password confirmation' : 'Show password confirmation'}
                  aria-pressed={showPasswordConfirmation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>

            <button type="submit" disabled={loading || code.length !== 6} className={buttonClass}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying and saving…</span></>
              ) : (
                <><ShieldCheck className="w-4 h-4" /><span>Verify email and save password</span></>
              )}
            </button>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={changeEmail}
                className="flex items-center gap-1 text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change email
              </button>
              <button
                type="button"
                onClick={handleRequestCode}
                disabled={loading}
                className="text-purple-300 hover:text-white disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {isSetupMode
              ? 'Codes expire after 10 minutes. Passwords are stored securely as hashes.'
              : 'Sign in with the password you set after verifying your email.'}
          </p>
        </div>
      </div>
    </div>
  );
}
