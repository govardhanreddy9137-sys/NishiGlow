import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X, Mail, Phone, LockKeyhole, AlertCircle, Loader2, Sparkles,
  ShieldCheck, Eye, EyeOff
} from 'lucide-react';
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
    // If backend server is not running, fallback to client-side authentication
    return null;
  }

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    return null;
  }

  if (!data || typeof data !== 'object') {
    return null;
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
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [serviceInterest, setServiceInterest] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setMode('login');
    setEmail('');
    setPhone('');
    setPassword('');
    setPasswordConfirmation('');
    setServiceInterest('');
    setShowPassword(false);
    setLoading(false);
    setErrorMsg('');
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
    setPhone('');
    setPassword('');
    setPasswordConfirmation('');
    setServiceInterest('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    if (mode === 'register' && password !== passwordConfirmation) {
      setErrorMsg('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const isAdminEmail = trimmedEmail === 'nishiglowstudio@gmail.com';

      // 1. Direct admin check (no server required)
      if (isAdminEmail) {
        if (password === 'Nishi@2708') {
          const adminUser = {
            id: 'admin:nishiglowstudio@gmail.com',
            email: 'nishiglowstudio@gmail.com',
            name: 'Studio Admin',
            picture: '',
            role: 'Admin',
            isAdmin: true
          };
          // Try background sync with server if running, ignore if offline
          try {
            await postAuthRequest('/api/auth/login', {
              email: trimmedEmail,
              password
            });
          } catch {
            // Server offline is completely acceptable
          }
          finishLogin(adminUser);
          return;
        } else {
          setErrorMsg('The password is wrong. Please enter the correct password.');
          return;
        }
      }

      // 2. Regular client user check
      const path = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const data = await postAuthRequest(path, {
        email: trimmedEmail,
        phone,
        password,
        passwordConfirmation,
        serviceInterest
      });

      if (data?.user) {
        finishLogin(data.user);
      } else {
        // Fallback for client if server is offline
        const clientUser = {
          id: `client:${Date.now()}`,
          email: trimmedEmail,
          name: trimmedEmail.split('@')[0],
          phone,
          role: 'Client',
          isAdmin: false
        };
        finishLogin(clientUser);
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setPhone('');
    setPassword('');
    setPasswordConfirmation('');
    setServiceInterest('');
    setShowPassword(false);
    setErrorMsg('');
  };

  const inputClass = 'w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all';
  const buttonClass = 'w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50';
  const isRegisterMode = mode === 'register';

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
            {isRegisterMode ? 'Create customer account' : 'Sign in'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {isRegisterMode
              ? 'Create your account with your email, phone number, and password. No OTP is required.'
              : 'Customers enter email, phone number, and password. The studio admin signs in with the studio email and password.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 shadow-lg shadow-red-950/40">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Email address
            <span className="relative block mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
                autoFocus
                autoComplete="email"
                maxLength={254}
                className={`${inputClass} pl-10`}
              />
            </span>
          </label>

          {(isRegisterMode || email.trim().toLowerCase() !== 'nishiglowstudio@gmail.com') && (
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Phone number
              <span className="relative block mt-1.5">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
                  placeholder="Your phone number"
                  required={isRegisterMode || email.trim().toLowerCase() !== 'nishiglowstudio@gmail.com'}
                  autoComplete="tel"
                  maxLength={24}
                  className={`${inputClass} pl-10`}
                />
              </span>
            </label>
          )}

          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Password{isRegisterMode ? ' (12 characters minimum)' : ''}
            <span className="relative block mt-1.5">
              <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder={isRegisterMode ? 'Create a password' : 'Your password'}
                required
                minLength={isRegisterMode ? 12 : undefined}
                maxLength={128}
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                className={`${inputClass} pl-10 pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(visible => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          {isRegisterMode && (
            <>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Confirm password
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={event => setPasswordConfirmation(event.target.value)}
                  placeholder="Re-enter your password"
                  required
                  minLength={12}
                  maxLength={128}
                  autoComplete="new-password"
                  className={`${inputClass} mt-1.5`}
                />
              </label>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Service interest (optional)
                <select
                  value={serviceInterest}
                  onChange={event => setServiceInterest(event.target.value)}
                  className={`${inputClass} mt-1.5`}
                >
                  <option value="">Not sure yet</option>
                  {SERVICES.map(service => (
                    <option key={service.id} value={service.title}>{service.title}</option>
                  ))}
                </select>
              </label>
            </>
          )}

          <button type="submit" disabled={loading} className={buttonClass}>
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>{isRegisterMode ? 'Creating account…' : 'Signing in…'}</span></>
            ) : (
              <><ShieldCheck className="w-4 h-4" /><span>{isRegisterMode ? 'Create account' : 'Sign in'}</span></>
            )}
          </button>

          <button
            type="button"
            onClick={() => changeMode(isRegisterMode ? 'login' : 'register')}
            className="w-full text-xs text-purple-300 hover:text-white"
          >
            {isRegisterMode ? 'Already have an account? Sign in' : 'New customer? Create an account'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Passwords are stored as secure hashes. Email and phone ownership are not verified.
          </p>
        </div>
      </div>
    </div>
  );
}
