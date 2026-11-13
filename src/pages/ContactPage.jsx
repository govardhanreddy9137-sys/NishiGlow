import React, { useState, useEffect } from 'react';
import { BRAND, SERVICES, createEmailLink } from '../data/siteData';
import { Mail, Camera, Send, CheckCircle2, AlertCircle, Sparkles, User, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage({ contactPrefill }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: SERVICES[0].title,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (contactPrefill) {
      setFormData(prev => ({
        ...prev,
        service: contactPrefill.service || prev.service,
        message: contactPrefill.details || prev.message
      }));
    }
  }, [contactPrefill]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const generateEmailLink = () => {
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\nDetails: ${formData.message}`;
    return createEmailLink(`Creative enquiry: ${formData.service}`, body);
  };

  return (
    <div className="relative overflow-hidden text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* 1. Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>GET IN TOUCH WITH NISHIGLOWSTUDIO</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Let's Bring Your Creative{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Vision To Life!
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          100% online studio serving clients across India. Send your enquiry through Gmail or connect with us on Instagram.
        </p>
      </section>

      {/* 2. Contact Details & Enquiry Form Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Official Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-purple-500/25 p-8 backdrop-blur-xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Direct Online Channels</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We operate exclusively online. Contact our creative specialists through Gmail or Instagram.
            </p>

            {/* Instagram contact card */}
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 hover:border-pink-500/50 hover:bg-pink-950/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-semibold text-pink-400 uppercase tracking-wide">Instagram DM</span>
                <p className="text-base font-bold text-white mt-0.5">@{BRAND.instagramHandle}</p>
                <p className="text-xs text-slate-400 mt-1">Message us directly on Instagram</p>
              </div>
            </a>

            {/* Official Email Card */}
            <a
              href={createEmailLink('Contact NISHIGLOWSTUDIO', '')}
              className="flex items-start gap-4 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-900/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wide">Official Contact Email</span>
                <p className="text-sm font-bold text-white mt-0.5 break-all">{BRAND.email}</p>
                <p className="text-xs text-slate-400 mt-1">Click to compose a message in Gmail</p>
              </div>
            </a>

            {/* Service Coverage Notice */}
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-pink-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pan-India Online Delivery</span>
              </div>
              <p>
                We service creators, startups, students, and businesses from every state and territory across India.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Functional Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-slate-900/90 border border-purple-500/30 p-8 sm:p-10 backdrop-blur-xl relative shadow-2xl">
            
            <h3 className="text-2xl font-bold text-white mb-1">
              Customer Enquiry Form
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Fill in your project requirements and we will review and get back to you promptly.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-fade-in">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Thank You, {formData.name}!</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  Your enquiry details are ready. Open Gmail to review and send them.
                </p>

                <div className="pt-3">
                  <a
                    href={generateEmailLink()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/30"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open Gmail Draft</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        service: SERVICES[0].title,
                        message: ''
                      });
                    }}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Submit another enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Customer Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Service Selection Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Select Creative Service *
                  </label>
                  <div className="relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.title} className="bg-slate-900 text-white">
                          {s.title}
                        </option>
                      ))}
                      <option value="Custom Bundle / Multiple Services" className="bg-slate-900 text-white">
                        Custom Bundle / Multiple Services
                      </option>
                    </select>
                    <HelpCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Customer Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Project Details & Message *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe what you want to create (e.g. 30 sec AI ad video for skincare, Instagram reel with subtitles, YouTube gaming thumbnail...)"
                    required
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-all"
                  ></textarea>
                </div>

                {/* Submit Enquiry Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Creative Enquiry</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </section>

    </div>
  );
}
