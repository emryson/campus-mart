'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, ShieldCheck, Users } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

type AdminUser = {
  id: string;
  role: 'student' | 'admin';
  schoolId: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  universityName: string;
  hostelOrHall: string;
  avatarUrl: string | null;
  isVerified: number;
  createdAt: string;
  activityCount: number;
};

export default function AdminDashboard() {
  const { currentUser } = useMarket();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    const response = await fetch('/api/admin/users', { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Unable to load users.');
      setIsLoading(false);
      return;
    }
    setUsers(result.users);
    setError(null);
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') void loadUsers();
    else setIsLoading(false);
  }, [currentUser]);

  if (currentUser?.role !== 'admin') {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
          <ShieldCheck className="w-10 h-10 text-rose-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-slate-900">Admin access required</h1>
          <p className="text-sm text-slate-500 mt-2">Sign in with an administrator account to view registered users.</p>
          <Link href="/admin/login" className="inline-block mt-5 text-sm font-semibold text-emerald-700 hover:underline">Go to admin login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to marketplace
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><Users className="w-5 h-5" /></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Registered users</h1>
                <p className="text-sm text-slate-500">Account details and activity summary. Passwords are never displayed.</p>
              </div>
            </div>
          </div>
          <button onClick={() => void loadUsers()} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {error && <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 p-4 mb-4 text-sm">{error}</div>}

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-100 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">School ID</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">University</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Activity</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">{user.name.charAt(0)}</div>}
                        <div><p className="font-semibold text-slate-900">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{user.schoolId}</td>
                    <td className="px-4 py-3 text-slate-700">{user.username}</td>
                    <td className="px-4 py-3 text-slate-700">{user.universityName}</td>
                    <td className="px-4 py-3 text-slate-700">{user.phone || 'Not provided'}<br /><span className="text-xs text-slate-500">{user.hostelOrHall}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>{user.role}</span></td>
                    <td className="px-4 py-3 text-slate-700">{user.activityCount}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isLoading && users.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No registered users yet.</p>}
        </div>
      </div>
    </main>
  );
}
