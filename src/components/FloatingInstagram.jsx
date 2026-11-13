import React from 'react';
import { BRAND } from '../data/siteData';
import { Camera } from 'lucide-react';

export default function FloatingInstagram() {
  return (
    <aside aria-label="Instagram quick connect" className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden sm:block mr-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-pink-500/30 text-xs text-white shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="font-semibold text-pink-400">DM on Instagram</span> • @{BRAND.instagramHandle}
      </div>

      <a
        href={BRAND.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Connect with NISHIGLOWSTUDIO on Instagram"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/70 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Pulse ring animation */}
        <span className="absolute -inset-1 rounded-full bg-pink-500/40 animate-ping opacity-75"></span>
        <Camera className="w-7 h-7 relative z-10" />
      </a>
    </aside>
  );
}
