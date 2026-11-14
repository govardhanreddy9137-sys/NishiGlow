import React from 'react';
import { BRAND, FAQS, createEmailLink, discountedPrice, DISCOUNT_PERCENT } from '../data/siteData';
import { useStudioData } from '../context/StudioDataContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  MessageSquare, 
  Zap, 
  Eye, 
  Palette, 
  Video, 
  ShieldCheck, 
  Tv, 
  CreditCard,
  Clock,
  Layers,
  Award,
  Star
} from 'lucide-react';

const iconMap = {
  Sparkles,
  Video,
  Palette,
  ShieldCheck,
  Tv,
  CreditCard
};

export default function HomePage({ setActivePage, setSelectedCategory }) {
  const { portfolioItems, services } = useStudioData();
  const startingPrice = Math.min(...services.flatMap(service =>
    service.pricing.map(price => discountedPrice(price.price))
  ));

  const handleServiceSelect = (serviceId) => {
    setActivePage('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePortfolioFilter = (category) => {
    if (setSelectedCategory) setSelectedCategory(category);
    setActivePage('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredPortfolioItems = [
    ...portfolioItems.filter(item => item.category === 'Posters'),
    ...portfolioItems.filter(item => item.category !== 'Posters')
  ].slice(0, 6);

  return (
    <div className="relative overflow-hidden text-slate-100">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Futuristic glowing orbs & mesh gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/25 via-pink-600/20 to-blue-600/25 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          
          {/* Studio Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide backdrop-blur-md shadow-lg shadow-purple-500/10 animate-pulse">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>100% ONLINE CREATIVE DIGITAL STUDIO ACROSS INDIA</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Turn Your Creative Ideas{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Into Reality!
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
              {BRAND.tagline}
            </p>
          </div>

          {/* Intro Description */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Welcome to <span className="text-white font-medium">{BRAND.name}</span> — the next-generation digital creative studio delivering high-impact AI advertisement videos, viral video editing, creative posters, modern brand logos, high-CTR YouTube thumbnails, and digital business cards. Crafted with passion, delivered digitally across India.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={createEmailLink('Creative project enquiry', `Hello ${BRAND.name},\n\nI would like to discuss a creative project.`)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 transition-all duration-300 shadow-xl shadow-purple-600/30 hover:shadow-purple-500/50 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Email Us on Gmail</span>
            </a>

            <button
              onClick={() => {
                setActivePage('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explore Services & Pricing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Stats Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-purple-500/15 max-w-4xl mx-auto text-center">
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/15 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">6+</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Creative Services</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/15 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-pink-400">100%</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Digital & Online</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/15 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">₹{startingPrice}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Starting price after 10% off</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/15 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">All India</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Online Delivery</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CREATIVE STUDIO INTRODUCTION WITH OFFICIAL POSTER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#090b14]/90 border border-purple-500/25 p-8 sm:p-12 lg:p-16 relative overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>ABOUT OUR CREATIVE STUDIO</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Designed for Creators, Startups & Modern Businesses
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                NISHIGLOWSTUDIO was conceived with a single, clear objective: providing world-class, agency-level digital creative assets directly to your fingertips without the exorbitant agency retainers.
              </p>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span><strong>AI-Driven Innovation:</strong> We harness cutting-edge generative tools to produce photorealistic marketing videos and aesthetic assets.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Creator & Business First:</strong> Whether you're a student building a personal brand, a YouTuber scaling views, or a startup launching products.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Seamless Digital Workflow:</strong> Order through Gmail or Instagram, review drafts on your phone, and receive print-ready & 4K assets online.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600/30 border border-purple-500/40 hover:bg-purple-600/50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Read Full Studio Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Graphic Card: Features Official NISHI Creative Studio Poster */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-pink-500/40 shadow-2xl shadow-pink-950/50 bg-slate-950">
                <img 
                  src="/images/nishi-studio-main-poster.jpg" 
                  alt="NISHI Creative Studio Official Poster"
                  className="w-full h-auto max-h-[520px] object-cover object-top hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-pink-600 text-white shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>Official Studio Poster</span>
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-purple-500/30">
                  <p className="text-xs uppercase tracking-wider text-pink-400 font-semibold">Ideas into Visuals • 100% Online</p>
                  <p className="text-sm font-bold text-white mt-0.5">High-impact creative visuals tailored for India's digital generation</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. DISPLAY ALL SIX SERVICES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>OUR 6 CORE SERVICES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            What We Create For You
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From viral video editing to AI advertising and bespoke branding, explore our premier suite of online creative services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv) => {
            const Icon = iconMap[srv.icon] || Sparkles;
            const minPrice = Math.min(...srv.pricing.map(p => discountedPrice(p.price)));
            const listedMinPrice = Math.min(...srv.pricing.map(p => p.price));

            return (
              <div
                key={srv.id}
                className="group relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0c0e1a]/90 border border-purple-500/20 hover:border-pink-500/50 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-900/30 flex flex-col justify-between"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600/30 to-pink-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:text-white group-hover:scale-110 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-pink-300">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm mt-2.5 leading-relaxed">
                    {srv.shortDesc}
                  </p>

                  {/* Pricing preview */}
                  <div className="mt-5 p-3 rounded-xl bg-purple-950/30 border border-purple-500/15">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Starting from <span className="text-emerald-300">{DISCOUNT_PERCENT}% off</span></span>
                      <span className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 line-through">₹{listedMinPrice}</span>
                        <span className="text-base font-extrabold text-cyan-300">₹{minPrice}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {srv.pricing.length} tailored duration/format packages available
                    </p>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleServiceSelect(srv.id)}
                    className="text-xs font-semibold text-purple-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Pricing Table</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={createEmailLink(`Enquiry: ${srv.title}`, `Hello ${BRAND.name},\n\nI am interested in ordering: ${srv.title}.`)}
                    className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors"
                    title="Enquire about this service by email"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED POSTERS & PORTFOLIO SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
              <Eye className="w-3.5 h-3.5" />
              <span>OFFICIAL STUDIO POSTERS & WORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Featured Posters & Creations
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Explore our verified studio posters and multimedia works across India.
            </p>
          </div>

          <button
            onClick={() => {
              setActivePage('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-purple-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Explore All In Portfolio ({portfolioItems.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Portfolio Grid (Featuring the original posters first) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredPortfolioItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handlePortfolioFilter(item.category)}
              className={`group relative rounded-3xl overflow-hidden bg-slate-900 border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-900/40 flex flex-col justify-between ${
                item.isOriginal ? 'border-pink-500/40 shadow-pink-950/30' : 'border-purple-500/20 hover:border-pink-500/50'
              }`}
            >
              <div className={`relative w-full overflow-hidden ${item.isOriginal ? 'h-80 sm:h-96' : 'h-64'}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
                    item.category === 'Posters' ? 'object-contain bg-black' : 'object-cover object-top'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b14] via-[#090b14]/30 to-transparent"></div>
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 backdrop-blur-md text-pink-300 border border-pink-500/30">
                    {item.category}
                  </span>
                  {item.isOriginal && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                      ★ Studio Original
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 relative z-10 flex-1 flex flex-col justify-between bg-slate-900/95">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.clientType}</span>
                  <span className="text-purple-400 font-semibold">{item.deliveryTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE US SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-tr from-purple-950/40 via-slate-900/90 to-blue-950/30 border border-purple-500/30 p-8 sm:p-14 backdrop-blur-xl relative overflow-hidden">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Creators & Businesses Choose Us
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Built on transparency, speed, and creative excellence across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-purple-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Rapid 24–48h Turnaround</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We understand the fast-paced nature of digital content. Receive thumbnails in hours and AI videos in 1–2 days.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-pink-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Affordable & Transparent</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No hidden costs or bloated agency charges. Get 10% off every service, with prices starting from ₹{startingPrice}.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Online Convenience</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero travel required. Order from any city, town or state in India through Gmail or Instagram.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER ENQUIRY CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 border border-purple-500/40 shadow-2xl shadow-purple-900/40 backdrop-blur-xl relative">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Have a Creative Project in Mind?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
            Let's discuss your ideas, share references, or get an immediate customized quote for your YouTube channel or brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-emerald-500 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Message Us on Instagram</span>
            </a>

            <button
              onClick={() => {
                setActivePage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm text-white bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Web Enquiry Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. FAQS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Everything you need to know about ordering our online creative services.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/70 border border-purple-500/20 backdrop-blur-sm"
            >
              <h3 className="text-sm sm:text-base font-bold text-purple-200">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
