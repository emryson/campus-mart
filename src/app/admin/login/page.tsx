'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export default function AdminLoginPage() {
  const { currentUser, loginAsAdmin } = useMarket();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (currentUser?.role === 'admin') {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-hairline rounded-md p-8 text-center">
          <ShieldCheck className="w-10 h-10 text-brand mx-auto mb-3" />
          <h1 className="text-2xl font-semibold text-ink">Admin session active</h1>
          <div className="flex items-center justify-center gap-4 mt-5">
            <Link href="/admin" className="text-sm font-semibold text-primary hover:underline">View registered users</Link>
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:underline">Marketplace</Link>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await loginAsAdmin(username, password);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error || 'Unable to sign in.');
      return;
    }
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-hairline rounded-md p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to marketplace
        </Link>
        <div className="w-12 h-12 rounded-sm bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-semibold text-ink">Admin login</h1>
        <p className="text-sm text-slate-500 mt-2 mb-6">Moderate listings and manage CampusMart activity.</p>
        {error && <p className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg p-3 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Admin username
            <input value={username} onChange={(event) => setUsername(event.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <span className="relative block mt-1">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20" />
            </span>
          </label>
          <button disabled={isSubmitting} className="w-full min-h-11 rounded-md bg-primary hover:bg-primary-hover text-white font-semibold py-2 disabled:opacity-45">
            {isSubmitting ? 'Signing in...' : 'Sign in as admin'}
          </button>
        </form>
      </div>
    </main>
  );
}
