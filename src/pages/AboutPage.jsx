import React from 'react';
import { BRAND, TESTIMONIALS, createEmailLink } from '../data/siteData';
import { Sparkles, Target, Compass, Heart, Shield, CheckCircle2, Mail, ArrowRight, Camera } from 'lucide-react';

export default function AboutPage({ setActivePage }) {
  return (
    <div className="relative overflow-hidden text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* 1. Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>ABOUT NISHIGLOWSTUDIO</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Where Creative Ideas Meet{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Digital Precision
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          {BRAND.tagline}
        </p>
      </section>

      {/* 2. Studio Introduction & Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Transforming The Landscape Of Online Creative Services
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            <strong className="text-purple-300">NISHIGLOWSTUDIO</strong> is a premier 100% online creative digital studio established to democratize modern agency-grade visual design and video production for ambitious creators, students, YouTubers, emerging startups, and enterprises across India.
          </p>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            We believe that impactful branding shouldn't require complex corporate retainers or physical meetings. By leveraging the latest AI video generation frameworks, high-retention video editing methodologies, and bespoke graphic design techniques, we provide our clients with convenient access to creative services through Gmail and Instagram.
          </p>

          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-pink-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% Online Delivery Ecosystem</span>
            </div>
            <p className="text-slate-400">
              Orders and inquiries from any corner of India are treated with equal dedication, speed, and creative obsession.
            </p>
          </div>
        </div>

        {/* Visual Showcase Card */}
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-slate-950 shadow-2xl shadow-purple-900/30 p-2">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80"
            alt="Studio Creative Workspace"
            className="w-full h-80 sm:h-96 object-cover rounded-2xl opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-2xl"></div>
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-purple-500/30">
            <p className="text-xs text-pink-400 font-semibold uppercase tracking-wider">Agency Standards • Zero Overhead</p>
            <p className="text-sm font-bold text-white mt-1">High-converting visuals built for the next wave of Indian digital creators</p>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-purple-950/30 to-slate-900/80 border border-purple-500/25 relative overflow-hidden backdrop-blur-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Our Mission</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Our mission is to empower individual creators, students, YouTubers, and business owners across India with visually captivating, top-tier creative media—including AI advertisement videos, engaging reels, professional brand logos, and click-optimized thumbnails—at transparent, affordable, and honest pricing.
          </p>
        </div>

        {/* Vision */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-pink-950/30 to-slate-900/80 border border-pink-500/25 relative overflow-hidden backdrop-blur-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Our Vision</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Our vision is to become India's most trusted and agile online creative digital studio, renowned for seamless customer communication, unmatched turnaround times, cutting-edge AI creative integration, and designs that drive tangible growth for our clients.
          </p>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white">Our Core Principles</h2>
          <p className="text-slate-400 text-sm mt-1">What guides every design, edit, and client interaction.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-purple-500/20 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Pure Creative Quality</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never cut corners. Every poster, logo, and video is meticulously refined for visual impact and emotional resonance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-pink-500/20 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Customer-Centric Care</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clear, friendly, and honest communication through Gmail and Instagram, with quick previews and responsive revisions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Integrity & Confidentiality</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your assets, raw footage, and brand materials are strictly protected and never leaked or shared.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials (Placeholders as specified) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium mb-2">
            <span>CLIENT REVIEWS (SAMPLE PLACEHOLDERS)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            What Our Community Says
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            (Editable placeholders ready to be updated with your actual customer reviews)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0b0e1b] border border-purple-500/20 flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div className="pt-3 border-t border-slate-800/80">
                <p className="text-xs font-bold text-white">{t.name}</p>
                <p className="text-[11px] text-purple-400">{t.role}</p>
                <span className="text-[10px] text-slate-500">{t.service}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-white">
          Ready to Work With NISHIGLOWSTUDIO?
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Get in touch through Gmail or Instagram for custom quotes tailored to your exact budget.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={createEmailLink('Creative project enquiry', `Hello ${BRAND.name},\n\nI would like to discuss a creative project and request a custom quote.`)}
            className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30"
          >
            <Mail className="w-4 h-4" />
            <span>Email Us on Gmail</span>
          </a>
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-pink-600 hover:bg-pink-500 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Message on Instagram</span>
          </a>
          <button
            onClick={() => {
              setActivePage('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-purple-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>View Services & Price List</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
