import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Pencil, RefreshCw, Save, Trash2, Users, X } from 'lucide-react';
import { SERVICES } from '../data/siteData';
import { authApiUrl } from '../authApi';

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
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editName, setEditName] = useState('');
  const [editInterest, setEditInterest] = useState('');

  const loadMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminRequest('/api/admin/members');
      setMembers(data.members);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    adminRequest('/api/admin/members')
      .then((data) => {
        if (!cancelled) setMembers(data.members);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : 'Could not load customers.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
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
    </section>
  );
}
