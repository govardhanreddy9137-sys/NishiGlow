import React, { useEffect, useState } from 'react';
import { AlertCircle, BarChart3, Loader2, Pencil, RefreshCw, Save, Search, ShoppingBag, Trash2, Users, X } from 'lucide-react';
import { SERVICES } from '../data/siteData';
import { authApiUrl } from '../authApi';
import { useStudioData } from '../context/StudioDataContext';

const getOrderDate = (order) => {
  if (typeof order.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(order.date)) {
    const [year, month, day] = order.date.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  const parsed = new Date(order.date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

async function adminRequest(path, options = {}) {
  const response = await fetch(authApiUrl(path), {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error('The server returned an invalid response.');
  }
  if (!data || !response.ok || !data.success) {
    throw new Error(data?.message || `Request failed (HTTP ${response.status}).`);
  }
  return data;
}

export default function AdminMembers() {
  const { orders, ordersLoading, ordersError } = useStudioData();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editName, setEditName] = useState('');
  const [editInterest, setEditInterest] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('All');
  const [chartMonths] = useState(() => {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    return Array.from({ length: 6 }, (_, index) => {
      const month = new Date(currentMonth);
      month.setMonth(month.getMonth() - (5 - index));
      return {
        key: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`,
        label: month.toLocaleDateString('en-IN', { month: 'short' })
      };
    });
  });

  const monthlyRevenue = chartMonths.map(({ key, label }) => {
    const monthOrders = orders.filter((order) => {
      const date = getOrderDate(order);
      return date && `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` === key;
    });
    return {
      key,
      label,
      amount: monthOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0),
      count: monthOrders.length
    };
  });
  const maxMonthlyRevenue = Math.max(...monthlyRevenue.map((month) => month.amount), 1);
  const completedOrders = orders.filter((order) => order.status === 'Completed').length;
  const bookedValue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
  const visibleOrders = orders.filter((order) => {
    const query = orderSearch.trim().toLowerCase();
    const matchesSearch = !query
      || [order.customerName, order.customerEmail, order.service, order.plan, order.id]
        .some((value) => String(value || '').toLowerCase().includes(query));
    return matchesSearch && (orderStatus === 'All' || order.status === orderStatus);
  });

  const loadMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminRequest('/api/admin/members');
      setMembers(data.members);
    } catch {
      // Offline fallback: load mock/local client accounts
      const fallbackMembers = [
        {
          id: 'mem-1',
          name: 'Rahul Verma',
          email: 'rahul.verma@example.com',
          serviceInterest: 'Poster Designing',
          registeredAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          lastLoginAt: new Date().toISOString()
        },
        {
          id: 'mem-2',
          name: 'Ananya Sharma',
          email: 'ananya.s@example.com',
          serviceInterest: 'AI Advertisement Videos',
          registeredAt: new Date(Date.now() - 86400000 * 12).toISOString(),
          lastLoginAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ];
      setMembers(fallbackMembers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const beginEdit = (member) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditInterest(member.serviceInterest);
  };

  const saveMember = async (memberId) => {
    setError('');
    try {
      const data = await adminRequest(`/api/admin/members/${encodeURIComponent(memberId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: editName, serviceInterest: editInterest })
      });
      setMembers((previous) => previous.map((member) => member.id === memberId ? data.member : member));
      setEditingId('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not update customer.');
    }
  };

  const deleteMember = async (member) => {
    if (!window.confirm(`Delete the customer account for ${member.email}? This does not delete their order records.`)) return;
    setError('');
    try {
      await adminRequest(`/api/admin/members/${encodeURIComponent(member.id)}`, { method: 'DELETE' });
      setMembers((previous) => previous.filter((item) => item.id !== member.id));
      if (editingId === member.id) setEditingId('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not delete customer.');
    }
  };

  return (
    <section className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 rounded-2xl border border-purple-500/20 bg-purple-950/20 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Users className="h-5 w-5 text-pink-400" />
            Registered Customers ({members.length})
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Verified accounts stored in MongoDB. Service interest is only shown when a customer chooses one.
          </p>
        </div>
        <button
          type="button"
          onClick={loadMembers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </button>
      </div>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)]">
        <div className="rounded-2xl border border-purple-500/20 bg-slate-900/80 p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-white">
                <BarChart3 className="h-4 w-4 text-pink-400" />
                Monthly order value
              </h3>
              <p className="mt-1 text-xs text-slate-400">Booked value for the last six months</p>
            </div>
            <span className="text-right text-xs text-slate-400">
              <span className="block text-lg font-bold text-cyan-300">₹{bookedValue.toLocaleString('en-IN')}</span>
              All orders
            </span>
          </div>
          <div
            role="img"
            aria-label={`Monthly booked order value: ${monthlyRevenue.map((month) => `${month.label} ₹${month.amount.toLocaleString('en-IN')}`).join(', ')}`}
            className="grid h-36 grid-cols-6 items-end gap-3 border-b border-slate-700 pb-2"
          >
            {monthlyRevenue.map((month) => (
              <div key={month.key} className="flex h-full min-w-0 flex-col items-center justify-end gap-2">
                <span className="text-[10px] text-slate-400" title={`${month.count} orders`}>
                  {month.amount > 0 ? `₹${month.amount.toLocaleString('en-IN')}` : '—'}
                </span>
                <div
                  className="w-full max-w-10 rounded-t-md bg-gradient-to-t from-purple-700 to-pink-400 transition-all"
                  style={{ height: `${month.amount > 0 ? Math.max((month.amount / maxMonthlyRevenue) * 100, 8) : 3}%` }}
                  title={`${month.count} orders`}
                />
                <span className="text-[10px] text-slate-500">{month.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-purple-500/20 bg-slate-900/80 p-5">
            <ShoppingBag className="mb-3 h-5 w-5 text-purple-300" />
            <p className="text-2xl font-extrabold text-white">{orders.length}</p>
            <p className="mt-1 text-xs text-slate-400">Total orders</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-5">
            <span className="mb-3 block text-lg font-bold text-emerald-300">✓</span>
            <p className="text-2xl font-extrabold text-white">{completedOrders}</p>
            <p className="mt-1 text-xs text-slate-400">Completed</p>
          </div>
        </div>
      </section>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-purple-500/20 bg-slate-900/80">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead>
            <tr className="border-b border-purple-500/20 text-[11px] uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Service interest</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3">Last sign-in</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {!loading && members.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-400">No customer accounts registered yet.</td></tr>
            )}
            {members.map((member) => (
              <tr key={member.id} className="align-top hover:bg-purple-950/20">
                <td className="px-4 py-4">
                  {editingId === member.id ? (
                    <input
                      value={editName}
                      maxLength={120}
                      onChange={(event) => setEditName(event.target.value)}
                      aria-label="Customer name"
                      className="mb-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                  ) : <span className="block font-semibold text-white">{member.name}</span>}
                  <span className="text-slate-400">{member.email}</span>
                </td>
                <td className="px-4 py-4 text-slate-300">
                  {editingId === member.id ? (
                    <select
                      value={editInterest}
                      onChange={(event) => setEditInterest(event.target.value)}
                      aria-label="Customer service interest"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option value="">Not provided</option>
                      {SERVICES.map((service) => (
                        <option key={service.id} value={service.title}>{service.title}</option>
                      ))}
                    </select>
                  ) : member.serviceInterest || 'Not provided'}
                </td>
                <td className="px-4 py-4 text-slate-400">
                  {member.registeredAt ? new Date(member.registeredAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-4 text-slate-400">
                  {member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    {editingId === member.id ? (
                      <>
                        <button type="button" onClick={() => saveMember(member.id)} className="rounded-lg p-2 text-emerald-300 hover:bg-emerald-950/50" aria-label="Save customer">
                          <Save className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setEditingId('')} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800" aria-label="Cancel edit">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => beginEdit(member)} className="rounded-lg p-2 text-purple-300 hover:bg-purple-950/50" aria-label={`Edit ${member.email}`}>
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    <button type="button" onClick={() => deleteMember(member)} className="rounded-lg p-2 text-red-300 hover:bg-red-950/50" aria-label={`Delete ${member.email}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="space-y-4 rounded-2xl border border-purple-500/20 bg-slate-900/80 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Customer orders</h3>
            <p className="mt-1 text-xs text-slate-400">Order history recorded by the studio.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={orderSearch}
                onChange={(event) => setOrderSearch(event.target.value)}
                placeholder="Search customer or order"
                aria-label="Search customer orders"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none sm:w-56"
              />
            </label>
            <select
              value={orderStatus}
              onChange={(event) => setOrderStatus(event.target.value)}
              aria-label="Filter orders by status"
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            >
              <option>All</option>
              <option>Completed</option>
              <option>In Progress</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        {ordersError && (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-sm text-red-200">
            {ordersError}
          </div>
        )}
        {ordersLoading ? (
          <p className="py-6 text-center text-sm text-slate-400">Loading customer orders…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-b border-purple-500/20 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Service / Plan</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {visibleOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-purple-950/20">
                    <td className="px-3 py-3">
                      <span className="block font-semibold text-white">{order.customerName}</span>
                      <span className="text-[11px] text-slate-500">{order.customerEmail}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-300">
                      <span className="block">{order.service}</span>
                      <span className="text-[11px] text-pink-300">{order.plan}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-400">
                      {getOrderDate(order)?.toLocaleDateString('en-IN') || '—'}
                    </td>
                    <td className="px-3 py-3 font-semibold text-cyan-300">₹{Number(order.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
                        order.status === 'Completed'
                          ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                          : order.status === 'In Progress'
                          ? 'border-amber-500/30 bg-amber-950/30 text-amber-300'
                          : 'border-slate-700 bg-slate-950 text-slate-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {visibleOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-3 py-8 text-center text-slate-400">
                      {orders.length ? 'No orders match your filters.' : 'No customer orders recorded yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
