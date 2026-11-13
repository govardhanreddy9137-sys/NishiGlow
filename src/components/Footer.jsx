import React from 'react';
import { BRAND, createEmailLink } from '../data/siteData';
import { Mail, Camera, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const handleNav = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-purple-500/15 bg-[#06080f] overflow-hidden pt-16 pb-12">
      {/* Background neon ambient aura */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5">
                <div className="w-full h-full bg-[#0d1021] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-pink-400 bg-clip-text text-transparent">
                {BRAND.name}
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed font-light">
              {BRAND.tagline}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-xs text-purple-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
              <span>100% Online Services across India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Explore Pages
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-purple-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-purple-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-purple-400 transition-colors">
                  Our Services & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('portfolio')} className="hover:text-purple-400 transition-colors">
                  Creative Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-purple-400 transition-colors">
                  Contact Us & Enquiry
                </button>
              </li>
            </ul>
          </div>

          {/* Services Quicklist */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Creative Offerings
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition-colors">• AI Promotional Video (₹1000)</li>
              <li className="hover:text-white transition-colors">• Video Editing (from ₹149)</li>
              <li className="hover:text-white transition-colors">• Poster Designing (from ₹99)</li>
              <li className="hover:text-white transition-colors">• Logo Designing (from ₹199)</li>
              <li className="hover:text-white transition-colors">• YouTube Thumbnails (from ₹79)</li>
              <li className="hover:text-white transition-colors">• Business Card Designing (from ₹149)</li>
            </ul>
          </div>

          {/* Direct Online Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Instant Online Contact
            </h4>
            <p className="text-xs text-slate-400">
              We handle all orders, briefs and inquiries 100% online through Instagram DM and official Gmail.
            </p>

            <div className="space-y-3 pt-1">
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-pink-950/30 border border-pink-500/20 hover:border-pink-500/50 hover:bg-pink-900/30 transition-all text-xs text-slate-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wide">Instagram DM</span>
                  <span className="font-semibold text-white">@{BRAND.instagramHandle}</span>
                </div>
              </a>

              <a
                href={createEmailLink('Contact NISHIGLOWSTUDIO', '')}
                className="flex items-center gap-3 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-900/30 transition-all text-xs text-slate-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wide">Official Studio Email</span>
                  <span className="font-semibold text-white break-all">{BRAND.email}</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All Rights Reserved. 100% Online Digital Creative Studio.
          </p>

          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('privacy')} className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('terms')} className="hover:text-purple-400 transition-colors">
              Terms & Conditions
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Serving Clients All Over India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
