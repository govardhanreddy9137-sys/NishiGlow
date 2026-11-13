import React, { useState } from 'react';
import { BRAND, createEmailLink } from '../data/siteData';
import { useStudioData } from '../context/StudioDataContext';
import { Sparkles, Mail, Filter, Play, Image as ImageIcon, Star, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PortfolioPage({ selectedCategory, setSelectedCategory }) {
  const { portfolioItems, deletePortfolioItem } = useStudioData();
  const { isAdmin } = useAuth();
  const [activeFilter, setActiveFilter] = useState(selectedCategory || 'All');
  const [modalItem, setModalItem] = useState(null);

  const categories = [
    'All',
    'Business Cards',
    'Logos',
    'YouTube Thumbnails',
    'Posters',
    'AI Videos',
    'Video Editing'
  ];

  const handleFilterChange = (cat) => {
    setActiveFilter(cat);
    if (setSelectedCategory) setSelectedCategory(cat);
  };

  const filteredItems = activeFilter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <div className="relative overflow-hidden text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* 1. Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>OUR WORK SHOWCASE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Creative{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Portfolio & Poster Gallery
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          Featuring our official <strong className="text-pink-300">NISHI Creative Studio Posters</strong>, AI advertisement videos, project presentation PPT posters, thumbnails, and brand identity designs.
        </p>

        {isAdmin && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-xs text-pink-300">
            <span>Admin Mode Enabled: You can delete items directly or add new ones in Admin Dashboard.</span>
          </div>
        )}
      </section>

      {/* 2. Category Filter Buttons */}
      <section className="flex flex-wrap items-center justify-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 mr-2 hidden sm:flex">
          <Filter className="w-3.5 h-3.5 text-purple-400" />
          <span>Category:</span>
        </div>

        {categories.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-purple-500/15'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </section>

      {/* 3. Portfolio Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredItems.map((item) => {
          const isVideoCategory = item.category === 'AI Videos' || item.category === 'Video Editing';

          return (
            <div
              key={item.id}
              className={`group relative rounded-3xl overflow-hidden bg-slate-900/90 border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                item.isOriginal
                  ? 'border-pink-500/50 shadow-pink-950/40 hover:shadow-pink-900/60'
                  : 'border-purple-500/20 hover:border-pink-500/50 hover:shadow-purple-900/30'
              }`}
            >
              {/* Media Container */}
              <div 
                onClick={() => setModalItem(item)}
                className={`relative w-full overflow-hidden cursor-pointer bg-slate-950 ${
                  item.category === 'Logos' ? 'h-72 sm:h-80 flex items-center justify-center p-3' : item.category === 'Posters' || item.category === 'YouTube Thumbnails' ? 'h-80 sm:h-96' : 'h-64'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
                    item.category === 'Logos' || item.category === 'Posters'
                      ? 'object-contain'
                      : 'object-cover object-top'
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Badge top-left */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 backdrop-blur-md text-pink-300 border border-pink-500/30">
                    {item.category}
                  </span>
                  {item.isOriginal && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      <span>Original Poster</span>
                    </span>
                  )}
                </div>

                {/* Admin Quick Delete */}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Admin Action: Delete "${item.title}"?`)) {
                        deletePortfolioItem(item.id);
                      }
                    }}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-red-950/80 hover:bg-red-600 text-red-200 border border-red-500/40 transition-colors"
                    title="Delete item (Admin)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Media indicator center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isVideoCategory ? (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-pink-600/60 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-600/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg shadow-purple-600/50 scale-75 group-hover:scale-100 transition-transform opacity-0 group-hover:opacity-100 duration-300">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {item.clientType}
                  </span>

                  <a
                    href={createEmailLink(`Portfolio enquiry: ${item.title}`, `Hello ${BRAND.name},\n\nI loved your portfolio work "${item.title}" and want to place an order.`)}
                    className="p-1.5 px-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                    title="Enquire about a similar style by email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Order Style</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. Modal Lightbox Preview */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#090b17] border border-purple-500/40 overflow-hidden shadow-2xl">
            <div className="relative max-h-[70vh] w-full bg-black flex items-center justify-center p-2">
              {modalItem.videoUrl ? (
                <div className="w-full max-h-[65vh] flex items-center justify-center bg-black">
                  <video
                    src={modalItem.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[60vh] object-contain rounded-xl"
                  />
                </div>
              ) : (
                <img
                  src={modalItem.image}
                  alt={modalItem.title}
                  className="max-h-[65vh] w-auto object-contain rounded-xl"
                />
              )}

              <button
                onClick={() => setModalItem(null)}
                className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">{modalItem.category}</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{modalItem.title}</h3>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
                  {modalItem.deliveryTime}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {modalItem.desc}
              </p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Category: {modalItem.clientType}</span>
                <a
                  href={createEmailLink(`Portfolio enquiry: ${modalItem.title}`, `Hello ${BRAND.name},\n\nI am interested in creating a project like: ${modalItem.title}.`)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/30"
                >
                  <Mail className="w-4 h-4" />
                  <span>Order by Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
