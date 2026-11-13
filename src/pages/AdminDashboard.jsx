import React, { useState } from 'react';
import { useStudioData } from '../context/StudioDataContext';
import { useAuth } from '../context/AuthContext';
import { 
  IndianRupee, 
  TrendingUp, 
  ShoppingBag, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  LogOut, 
  ArrowLeft,
  Upload,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AdminMembers from '../components/AdminMembers';

export default function AdminDashboard({ setActivePage }) {
  const { adminUser, logoutAdmin, isAdmin, authReady, openAuthModal } = useAuth();
  const { 
    portfolioItems, 
    addPortfolioItem, 
    deletePortfolioItem, 
    orders, 
    addOrder, 
    deleteOrder, 
    updateOrderStatus,
    services,
    updateServicePrice,
    totalRevenue,
    pendingRevenue,
    resetToDefault,
    ordersLoading,
    ordersError
  } = useStudioData();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'prices', 'portfolio', 'revenue', 'add-item'
  const [priceUpdateNotice, setPriceUpdateNotice] = useState('');

  // New Portfolio Item Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('AI Videos');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('/images/nishi-studio-main-poster.jpg');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newBadge, setNewBadge] = useState('Studio Special');
  const [newClientType, setNewClientType] = useState('Online Client');
  const [newDeliveryTime, setNewDeliveryTime] = useState('12–24 Hours');
  const [formSuccess, setFormSuccess] = useState('');

  // Quick Order Add Form State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newOrderService, setNewOrderService] = useState('Poster Designing');
  const [newOrderPlan, setNewOrderPlan] = useState('Creative Poster');
  const [newOrderAmount, setNewOrderAmount] = useState('149');
  const [newOrderStatus, setNewOrderStatus] = useState('Pending');
  const [orderSuccess, setOrderSuccess] = useState('');

  const handleCreatePortfolioItem = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImage.trim()) return;

    addPortfolioItem({
      title: newTitle.trim(),
      category: newCategory,
      badge: newBadge.trim() || 'New Design',
      desc: newDesc.trim() || 'High impact creative digital asset designed by NISHIGLOWSTUDIO.',
      image: newImage.trim(),
      videoUrl: newVideoUrl.trim() || null,
      clientType: newClientType.trim() || 'Client Project',
      deliveryTime: newDeliveryTime.trim() || '24 Hours',
      isOriginal: true
    });

    confetti({ particleCount: 70, spread: 60 });
    setFormSuccess('Creative item added to portfolio gallery successfully!');
    setNewTitle('');
    setNewDesc('');
    setNewVideoUrl('');
    setTimeout(() => setFormSuccess(''), 3000);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newOrderAmount) return;

    const created = await addOrder({
      customerName: newCustomerName.trim(),
      customerEmail: newCustomerEmail.trim() || 'client@online.com',
      service: newOrderService,
      plan: newOrderPlan,
      amount: Number(newOrderAmount),
      status: newOrderStatus,
      paymentMethod: 'UPI'
    });

    if (!created) return;
    confetti({ particleCount: 60, spread: 50 });
    setOrderSuccess('Revenue order recorded successfully!');
    setNewCustomerName('');
    setNewCustomerEmail('');
    setTimeout(() => setOrderSuccess(''), 3000);
  };

  if (!authReady) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-300">Checking admin access…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center text-slate-100">
        <h1 className="text-2xl font-bold">Admin sign-in required</h1>
        <p className="text-sm text-slate-400">Sign in with an approved studio email to access customer and revenue records.</p>
        <button
          type="button"
          onClick={openAuthModal}
          className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-500"
        >
          Sign in as admin
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Top Admin Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              STUDIO ADMIN CONTROL CENTER
            </span>
            <span className="text-xs text-slate-400">Authenticated: {adminUser?.email}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Revenue Analytics & Content Manager
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-purple-500/30 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              setActivePage('home');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-950/40 border border-red-500/30 hover:bg-red-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-purple-500/15'
          }`}
        >
          Overview & Revenue
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'prices'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-purple-500/15'
          }`}
        >
          💰 Edit Service Prices
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'portfolio'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-purple-500/15'
          }`}
        >
          Manage Posters & Portfolio ({portfolioItems.length})
        </button>

        <button
          onClick={() => setActiveTab('add-item')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'add-item'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-purple-500/15'
          }`}
        >
          + Add New Poster / Work
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-purple-500/15'
          }`}
        >
          Registered Customers
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-purple-500/15'
          }`}
        >
          Order Transactions ({orders.length})
        </button>
      </div>

      {/* 1. OVERVIEW & REVENUE ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Revenue KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Realized Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mt-3">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 100% Online Bank / UPI Orders
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">In-Progress Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-amber-300 mt-3">₹{pendingRevenue.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-400 mt-1">Orders currently being created</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Orders Processed</span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mt-3">{orders.length}</p>
              <p className="text-[11px] text-purple-400 mt-1">Across 6 creative categories</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Work Showcase</span>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-cyan-300 mt-3">{portfolioItems.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">Live posters & media files</p>
            </div>

          </div>

          {/* Quick Record Order Section */}
          <div className="rounded-3xl bg-slate-900/80 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Plus className="w-5 h-5 text-pink-400" />
              <span>Record New Customer Order & Revenue</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              When a client orders via Gmail or Instagram, record the transaction here to update live studio revenue metrics.
            </p>

            {orderSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {orderSuccess}
              </div>
            )}

            <form onSubmit={handleCreateOrder} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Babu"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Customer Email</label>
                <input
                  type="email"
                  placeholder="ramesh@gmail.com"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Creative Service</label>
                <select
                  value={newOrderService}
                  onChange={(e) => setNewOrderService(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="Poster Designing">Poster Designing</option>
                  <option value="AI Advertisement Videos">AI Advertisement Videos</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Logo Designing">Logo Designing</option>
                  <option value="YouTube Thumbnail Designing">YouTube Thumbnail</option>
                  <option value="Business Card Designing">Business Card</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Plan / Package</label>
                <input
                  type="text"
                  placeholder="e.g. Creative Poster"
                  value={newOrderPlan}
                  onChange={(e) => setNewOrderPlan(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="149"
                  min="0"
                  step="0.01"
                  value={newOrderAmount}
                  onChange={(e) => setNewOrderAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500 font-bold text-cyan-300"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Order Status</label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-md shadow-pink-600/30 cursor-pointer"
                >
                  + Add Order
                </button>
              </div>
            </form>
          </div>

          {/* Recent Orders List */}
          <div className="rounded-3xl bg-slate-900/90 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Client Transactions</h3>
              <span className="text-xs text-purple-400">Total {orders.length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-purple-500/20 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service & Plan</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-300">{o.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{o.customerName}</span>
                        <span className="text-[11px] text-slate-500">{o.customerEmail}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-300 block">{o.service}</span>
                        <span className="text-[11px] text-pink-400 font-medium">{o.plan}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{o.date}</td>
                      <td className="py-3 px-4 font-extrabold text-cyan-300">₹{o.amount}</td>
                      <td className="py-3 px-4">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-950 border ${
                            o.status === 'Completed'
                              ? 'text-emerald-300 border-emerald-500/40'
                              : o.status === 'In Progress'
                              ? 'text-amber-300 border-amber-500/40'
                              : 'text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => deleteOrder(o.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT SERVICE PRICES SECTION */}
      {activeTab === 'prices' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Edit & Customize Live Service Prices (INR ₹)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Modify prices for any tier. Changes update instantly across the Home page and Services page.
              </p>
            </div>

            <button
              onClick={resetToDefault}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Standard Prices</span>
            </button>
          </div>

          {priceUpdateNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{priceUpdateNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-3xl bg-slate-900/90 border border-purple-500/20 p-6 backdrop-blur-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        {service.badge}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">{service.title}</h4>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {service.pricing.length} Tiers
                    </span>
                  </div>

                  <div className="space-y-3 mt-4">
                    {service.pricing.map((tier, idx) => {
                      const tierName = tier.duration || tier.service;
                      return (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/60 border border-purple-500/10 hover:border-purple-500/30 transition-all"
                        >
                          <div>
                            <span className="text-xs font-semibold text-white block">{tierName}</span>
                            <span className="text-[11px] text-slate-400">{tier.label}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-semibold">₹</span>
                            <input
                              type="number"
                              defaultValue={tier.price}
                              onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0 && val !== tier.price) {
                                  updateServicePrice(service.id, idx, val);
                                  setPriceUpdateNotice(`Updated "${service.title} - ${tierName}" price to ₹${val}`);
                                  setTimeout(() => setPriceUpdateNotice(''), 3000);
                                }
                              }}
                              className="w-24 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-sm text-right focus:outline-none focus:border-pink-500"
                            />
                            <span className="text-[10px] text-emerald-400 font-medium">Live</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                  Tip: Change number and click outside the box to save automatically.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MANAGE PORTFOLIO & POSTERS (ADD / DELETE) */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20">
            <div>
              <h3 className="text-lg font-bold text-white">Live Portfolio & Poster Gallery</h3>
              <p className="text-xs text-slate-400">
                You can delete any sample item or add new posters anytime. All changes update instantly on the public website.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('add-item')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Poster</span>
              </button>

              <button
                onClick={resetToDefault}
                title="Reset to default items"
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl overflow-hidden bg-slate-900/90 border border-purple-500/25 hover:border-pink-500/50 transition-all flex flex-col justify-between"
              >
                <div className="relative h-60 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 backdrop-blur-md text-pink-300 border border-pink-500/30">
                      {item.category}
                    </span>
                    {item.isOriginal && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-purple-600/90 text-white">
                        ★ Studio Original
                      </span>
                    )}
                  </div>

                  {/* Delete button on card */}
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                        deletePortfolioItem(item.id);
                      }
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 transition-colors shadow-lg cursor-pointer"
                    title="Delete this item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>{item.clientType}</span>
                    <span className="text-purple-400 font-semibold">{item.deliveryTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ADD NEW POSTER / CREATIVE WORK FORM */}
      {activeTab === 'add-item' && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/90 border border-purple-500/30 p-8 sm:p-10 backdrop-blur-xl space-y-6 animate-fade-in">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-400" />
              <span>Add New Poster or Portfolio Design</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Publish new creative designs or posters to your official showcase.
            </p>
          </div>

          {formSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCreatePortfolioItem} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Item Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Creative Services - Studio Original Poster"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="Posters">Posters</option>
                  <option value="AI Videos">AI Videos</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Logos">Logos</option>
                  <option value="YouTube Thumbnails">YouTube Thumbnails</option>
                  <option value="Business Cards">Business Cards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Badge / Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Studio Original"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Image / Cover Poster URL *
              </label>
              <input
                type="text"
                placeholder="/images/nishi-studio-main-poster.jpg or https://..."
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Video File URL or Path (Optional for AI Videos & Reels)
              </label>
              <input
                type="text"
                placeholder="e.g. /videos/my-reel.mp4 or https://... (MP4 / WebM)"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Place your MP4 files in the <code>public/videos/</code> directory or provide an external MP4 URL.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of the poster/project..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Client Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Official Studio Original"
                  value={newClientType}
                  onChange={(e) => setNewClientType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Turnaround / Delivery Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12 Hours"
                  value={newDeliveryTime}
                  onChange={(e) => setNewDeliveryTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Upload className="w-4 h-4" />
              <span>Publish to Portfolio & Posters</span>
            </button>
          </form>
        </div>
      )}

      {activeTab === 'members' && <AdminMembers />}

      {/* 4. ORDERS & TRANSACTIONS TAB */}
      {activeTab === 'orders' && (
        <div className="rounded-3xl bg-slate-900/90 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-xl space-y-6 animate-fade-in">
          {ordersError && (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-sm text-red-200">
              {ordersError}
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Complete Customer Order Book</h3>
              <p className="text-xs text-slate-400">Revenue is based on orders recorded by the studio; it is not automatically verified against payment providers.</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs">
              <span className="text-slate-400">Total Booked Value: </span>
              <span className="font-extrabold text-cyan-300 text-sm">
                ₹{orders.reduce((sum, o) => sum + Number(o.amount || 0), 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {ordersLoading && <p className="text-sm text-slate-400">Loading order records…</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-500/20 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-purple-300">{o.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{o.customerName}</span>
                      <span className="text-[11px] text-slate-500">{o.customerEmail}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{o.service}</td>
                    <td className="py-3 px-4 text-pink-400 font-medium">{o.plan}</td>
                    <td className="py-3 px-4 font-extrabold text-cyan-300 text-sm">₹{o.amount}</td>
                    <td className="py-3 px-4 text-slate-400">{o.paymentMethod || 'UPI'}</td>
                    <td className="py-3 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-950 border ${
                          o.status === 'Completed'
                            ? 'text-emerald-300 border-emerald-500/40'
                            : o.status === 'In Progress'
                            ? 'text-amber-300 border-amber-500/40'
                            : 'text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteOrder(o.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!ordersLoading && orders.length === 0 && (
                  <tr><td colSpan="8" className="px-4 py-10 text-center text-slate-400">No order or revenue records yet. Record real orders from the overview tab.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
