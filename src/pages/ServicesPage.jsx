import React, { useState } from 'react';
import { BRAND, createEmailLink } from '../data/siteData';
import { useStudioData } from '../context/StudioDataContext';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Zap, 
  Mail,
  Video, 
  Palette, 
  ShieldCheck, 
  Tv, 
  CreditCard 
} from 'lucide-react';

const iconMap = {
  Sparkles,
  Video,
  Palette,
  ShieldCheck,
  Tv,
  CreditCard
};

export default function ServicesPage({ setActivePage, setContactPrefill }) {
  const { services } = useStudioData();
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'ai-videos');

  const activeService = services.find(s => s.id === selectedServiceId) || services[0];
  const ActiveIcon = iconMap[activeService?.icon] || Sparkles;

  const handleEnquireService = (serviceTitle, packageLabel) => {
    if (setContactPrefill) {
      setContactPrefill({
        service: serviceTitle,
        details: `Interested in ${serviceTitle} (${packageLabel || 'Standard Package'})`
      });
    }
    setActivePage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getServiceEmailLink = (serviceTitle, itemDesc, price) => {
    const body = `Hello ${BRAND.name},\n\nI would like to order:\nService: ${serviceTitle}\nPlan: ${itemDesc} (₹${price})\n\nPlease let me know the details.`;
    return createEmailLink(`Order enquiry: ${serviceTitle}`, body);
  };

  return (
    <div className="relative overflow-hidden text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* 1. Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>OUR 6 CORE CREATIVE OFFERINGS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Explore Our Services &{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Transparent Price List
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          Affordable, creative, and professional digital services designed specifically for individuals, students, creators, and businesses across India.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-purple-500/30 text-xs text-slate-300">
          <span className="text-pink-400 font-bold">100% Online Services</span>
          <span>•</span>
          <span className="text-cyan-400 font-bold">Gmail & Instagram Contact</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">Orders Across India</span>
        </div>
      </section>

      {/* 2. Service Tab Selector */}
      <section className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {services.map((s) => {
          const Icon = iconMap[s.icon] || Sparkles;
          const isSelected = s.id === selectedServiceId;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedServiceId(s.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-purple-500/15'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{s.title}</span>
            </button>
          );
        })}
      </section>

      {/* 3. Detailed Active Service Showcase */}
      <section className="rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0c0e1a]/95 border border-purple-500/25 p-6 sm:p-10 lg:p-12 relative overflow-hidden backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ActiveIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {activeService.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {activeService.title}
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {activeService.details}
            </p>

            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Key Deliverables & Capabilities:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {activeService.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-purple-500/10">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* General CTA for this service */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={createEmailLink(`Enquiry: ${activeService.title}`, `Hello ${BRAND.name},\n\nI want to enquire about ${activeService.title}.`)}
                className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Email About This Service</span>
              </a>

              <button
                onClick={() => handleEnquireService(activeService.title, 'General Enquiry')}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-purple-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-purple-400" />
                <span>Individual Enquiry Form</span>
              </button>
            </div>
          </div>

          {/* Right Column: Sample Placeholder Card with Video Playback */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-purple-500/30 bg-slate-950 shadow-xl relative group">
              {activeService.sampleVideo ? (
                <div className="relative w-full h-64 sm:h-72 bg-black flex items-center justify-center">
                  <video
                    src={activeService.sampleVideo}
                    controls
                    playsInline
                    poster={activeService.samplePlaceholder}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <img
                  src={activeService.samplePlaceholder}
                  alt={activeService.title}
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-purple-500/30 text-xs pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-pink-400">
                  {activeService.sampleVideo ? 'Playable Video Showcase' : 'Sample Work Showcase'}
                </span>
                <p className="text-white font-medium mt-0.5">{activeService.title} Showcase</p>
              </div>
            </div>
          </div>

        </div>

        {/* Pricing List Table Component for Active Service */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{activeService.title} – Price List</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                CREATIVE • PROFESSIONAL • AFFORDABLE
              </p>
            </div>

            <span className="text-xs text-cyan-400 font-medium">
              Transparent Pricing (INR)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-purple-500/20 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Service Tier / Duration</th>
                  <th className="py-3 px-4">Description / Use Case</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeService.pricing.map((p, idx) => {
                  const titleKey = p.duration || p.service;
                  return (
                    <tr key={idx} className="hover:bg-purple-950/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {titleKey}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {p.label}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-cyan-300 text-sm sm:text-base">
                        ₹{p.price}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={getServiceEmailLink(activeService.title, titleKey, p.price)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Order this specific plan by email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Order</span>
                          </a>

                          <button
                            onClick={() => handleEnquireService(activeService.title, `${titleKey} (₹${p.price})`)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                          >
                            Enquire
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* 4. Complete Full Price List Overview (All 6 Services in One Place) */}
      <section className="space-y-8 pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-purple-500/30 text-xs text-purple-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>COMPLETE STUDIO RATE CARD</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">All 6 Services Pricing Master List</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Beginner-friendly and professional pricing for every creative need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <div
                key={service.id}
                className="rounded-2xl bg-slate-900/70 border border-purple-500/20 p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-white text-sm sm:text-base">
                        {service.title}
                      </h3>
                    </div>
                    <Icon className="w-4 h-4 text-purple-400" />
                  </div>

                  <div className="space-y-2 mt-4">
                    {service.pricing.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
                        <span className="text-slate-300">{item.duration || item.service}</span>
                        <span className="font-bold text-cyan-300">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="text-xs text-purple-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <a
                    href={createEmailLink(`Order enquiry: ${service.title}`, `Hello ${BRAND.name},\n\nI am looking to order ${service.title}.`)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                  >
                    Email
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Bottom Consultation Banner */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-blue-950/40 border border-purple-500/30 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Need a Custom Bundle or Bulk Order?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Need monthly video editing for your YouTube channel or an all-in-one branding package with posters and logos? We offer custom bundles tailored to your goals.
        </p>
        <div className="pt-2">
          <a
            href={createEmailLink('Custom package enquiry', `Hello ${BRAND.name},\n\nI need a custom package or monthly retainer bundle for my business/channel.`)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 transition-all shadow-lg shadow-purple-600/30"
          >
            <Mail className="w-4 h-4" />
            <span>Email Us For Custom Pricing</span>
          </a>
        </div>
      </section>

    </div>
  );
}
