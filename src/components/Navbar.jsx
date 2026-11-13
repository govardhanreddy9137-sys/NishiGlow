import React, { useState } from 'react';
import { BRAND, createEmailLink } from '../data/siteData';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Sparkles, User, LogOut, CheckCircle, Camera, ShieldAlert, Mail } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    currentUser, 
    isAuthenticated, 
    openAuthModal, 
    logout,
    adminUser,
    isAdmin,
    logoutAdmin
  } = useAuth();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Our Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090b14]/85 border-b border-purple-500/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/30 group-hover:shadow-pink-500/50 transition-all duration-300">
            <div className="w-full h-full bg-[#0d1021] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400 group-hover:text-pink-400 transition-colors" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-purple-200 to-pink-400 bg-clip-text text-transparent group-hover:to-cyan-300 transition-all">
              {BRAND.name}
            </span>
            <span className="hidden sm:block text-[10px] tracking-widest text-slate-400 font-medium uppercase">
              Creative Digital Studio
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative cursor-pointer ${
                  isActive
                    ? 'text-white bg-purple-600/20 border border-purple-500/40 shadow-sm shadow-purple-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></span>
                )}
              </button>
            );
          })}

          {/* Admin Dashboard shortcut visible ONLY when logged in */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activePage === 'admin'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/40'
                  : 'bg-pink-950/40 text-pink-300 border border-pink-500/40 hover:bg-pink-900/40'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Studio Dashboard</span>
            </button>
          )}
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden lg:flex items-center gap-2.5">
          {isAdmin ? (
            <div className="flex items-center gap-2 bg-pink-950/40 border border-pink-500/30 px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-bold text-pink-300">Studio Manager</span>
              <button
                onClick={logoutAdmin}
                title="Logout Studio Manager"
                className="p-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-white max-w-[110px] truncate">{currentUser?.email}</p>
                <p className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle className="w-2.5 h-2.5" /> Verified
                </p>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-200 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Instagram Connect Button */}
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:opacity-90 transition-all shadow-md shadow-pink-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>@{BRAND.instagramHandle}</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {!isAdmin && !isAuthenticated && (
            <button
              onClick={openAuthModal}
              className="px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/40 border border-purple-500/30 rounded-lg"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/60 border border-slate-700/50 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-purple-500/20 bg-[#090b14]/95 px-4 pt-2 pb-6 space-y-2 backdrop-blur-2xl animate-fade-in">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white bg-purple-600/30 border border-purple-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold bg-pink-950/40 border border-pink-500/30 text-pink-300"
            >
              ★ Open Studio Dashboard (Revenue & Posters)
            </button>
          )}

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            {isAdmin ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-pink-950/30 border border-pink-500/20">
                <div>
                  <p className="text-xs font-semibold text-white">{adminUser?.email}</p>
                  <span className="text-[10px] text-pink-400">Studio Manager</span>
                </div>
                <button
                  onClick={logoutAdmin}
                  className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{currentUser?.email}</p>
                    <span className="text-[10px] text-emerald-400">Verified Client</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-purple-400" />
                <span>Sign In</span>
              </button>
            )}

            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30"
            >
              <Camera className="w-4 h-4" />
              <span>DM on Instagram (@{BRAND.instagramHandle})</span>
            </a>

            <a
              href={createEmailLink('Contact NISHIGLOWSTUDIO', '')}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-purple-200 bg-purple-950/40 border border-purple-500/30 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-purple-400" />
              <span>{BRAND.email}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
