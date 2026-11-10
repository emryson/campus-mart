'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, PackageOpen, RefreshCw, ShieldCheck, Users, X } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import type { CampusItem } from '@/types/market';

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
  const [listings, setListings] = useState<CampusItem[]>([]);
  const [selectedListing, setSelectedListing] = useState<CampusItem | null>(null);
  const [activeView, setActiveView] = useState<'listings' | 'users'>('listings');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/admin/users', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to load users.');
      setUsers(result.users);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load users.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadListings = async () => {
    setIsLoadingListings(true);
    try {
      const response = await fetch('/api/listings', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to load listings.');
      setListings(result.listings);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load listings.');
    } finally {
      setIsLoadingListings(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      void loadUsers();
      void loadListings();
    } else {
      setIsLoadingUsers(false);
      setIsLoadingListings(false);
    }
  }, [currentUser]);

  if (currentUser?.role !== 'admin') {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-hairline rounded-md p-8 text-center">
          <ShieldCheck className="w-10 h-10 text-danger mx-auto mb-3" />
          <h1 className="text-2xl font-semibold text-ink">Admin access required</h1>
          <p className="text-sm text-slate-500 mt-2">Sign in with an administrator account to manage listings and users.</p>
          <Link href="/admin/login" className="inline-block mt-5 text-sm font-semibold text-primary hover:underline">Go to admin login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to marketplace
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-sm bg-primary-soft text-primary flex items-center justify-center"><Users className="w-5 h-5" /></div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-ink">Admin dashboard</h1>
                <p className="text-sm text-slate-500">Review marketplace listings and registered users.</p>
              </div>
            </div>
          </div>
          <button onClick={() => void (activeView === 'listings' ? loadListings() : loadUsers())} className="inline-flex min-h-11 items-center justify-center gap-2 px-4 rounded-md bg-white border border-hairline-strong text-sm font-semibold text-ink-600 hover:bg-well">
            <RefreshCw className={`w-4 h-4 ${(activeView === 'listings' ? isLoadingListings : isLoadingUsers) ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {error && <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 p-4 mb-4 text-sm">{error}</div>}

        <div className="flex border-b border-hairline mb-4" role="tablist" aria-label="Admin views">
          {(['listings', 'users'] as const).map((view) => (
            <button
              key={view}
              id={`admin-tab-${view}`}
              role="tab"
              aria-selected={activeView === view}
              aria-controls={`admin-panel-${view}`}
              onClick={() => setActiveView(view)}
              className={`min-h-11 px-4 text-sm font-semibold border-b-2 capitalize transition-colors ${activeView === view ? 'text-primary border-primary' : 'text-slate-600 border-transparent hover:text-ink'}`}
            >
              {view}
            </button>
          ))}
        </div>

        {activeView === 'listings' ? (
          <section id="admin-panel-listings" role="tabpanel" aria-labelledby="admin-tab-listings" className="bg-white border border-hairline rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-white border-b border-hairline-strong text-xs font-semibold text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Listing</th>
                    <th className="px-4 py-3">Seller</th>
                    <th className="px-4 py-3">University</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Posted</th>
                    <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-soft">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-well">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-ink">{listing.title}</p>
                        <p className="text-xs text-slate-600 capitalize">{listing.category}</p>
                      </td>
                      <td className="px-4 py-3 text-ink-600">{listing.seller.name}</td>
                      <td className="px-4 py-3 text-ink-600">{listing.universityName}</td>
                      <td className="px-4 py-3 font-semibold text-ink">GH₵ {listing.price.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${listing.isSold ? 'bg-well text-slate-600' : 'bg-success-bg text-success-text'}`}>
                          {listing.isSold ? 'Sold' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{new Date(listing.createdAt).toLocaleDateString('en-GH')}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedListing(listing)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 px-3 text-xs font-semibold text-primary hover:bg-primary-soft rounded-md"
                          aria-label={`View ${listing.title}`}
                          title="View listing"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!isLoadingListings && listings.length === 0 && <p className="p-8 text-center text-sm text-slate-600">No listings found.</p>}
            {isLoadingListings && <p className="p-8 text-center text-sm text-slate-600">Loading listings...</p>}
          </section>
        ) : (
          <section id="admin-panel-users" role="tabpanel" aria-labelledby="admin-tab-users" className="bg-white border border-hairline rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-white border-b border-hairline-strong text-xs font-semibold text-slate-600">
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
                <tbody className="divide-y divide-hairline-soft">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-well">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center font-semibold">{user.name.charAt(0)}</div>}
                          <div><p className="font-semibold text-ink">{user.name}</p><p className="text-xs text-slate-600">{user.email}</p></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-600">{user.schoolId}</td>
                      <td className="px-4 py-3 text-ink-600">{user.username}</td>
                      <td className="px-4 py-3 text-ink-600">{user.universityName}</td>
                      <td className="px-4 py-3 text-ink-600">{user.phone || 'Not provided'}<br /><span className="text-xs text-slate-600">{user.hostelOrHall}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-warning-bg text-warning-text' : 'bg-well text-ink-600'}`}>{user.role}</span></td>
                      <td className="px-4 py-3 text-ink-600">{user.activityCount}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{new Date(user.createdAt).toLocaleDateString('en-GH')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!isLoadingUsers && users.length === 0 && <p className="p-8 text-center text-sm text-slate-600">No registered users yet.</p>}
            {isLoadingUsers && <p className="p-8 text-center text-sm text-slate-600">Loading users...</p>}
          </section>
        )}
      </div>

      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/28 p-4" onClick={() => setSelectedListing(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="listing-detail-title"
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-hairline rounded-md shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="sticky top-0 flex items-center justify-between gap-4 bg-white border-b border-hairline-soft px-5 py-4">
              <div className="min-w-0">
                <h2 id="listing-detail-title" className="text-lg font-semibold text-ink truncate">{selectedListing.title}</h2>
                <p className="text-xs text-slate-600">{selectedListing.universityName} · {selectedListing.category}</p>
              </div>
              <button type="button" onClick={() => setSelectedListing(null)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-ink-600 hover:bg-well" aria-label="Close listing details">
                <X className="w-5 h-5" />
              </button>
            </header>
            <div className="p-5 space-y-5">
              {selectedListing.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedListing.images.map((image, index) => (
                    <img key={`${selectedListing.id}-${index}`} src={image} alt={`${selectedListing.title}, photo ${index + 1}`} className="w-full aspect-square object-cover rounded-sm border border-hairline" />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center aspect-[16/7] bg-well text-slate-600 rounded-sm"><PackageOpen className="w-6 h-6" /></div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-slate-600">Price</p><p className="font-semibold text-ink">GH₵ {selectedListing.price.toLocaleString()} {selectedListing.isNegotiable ? '· Negotiable' : ''}</p></div>
                <div><p className="text-xs text-slate-600">Condition</p><p className="font-semibold text-ink capitalize">{selectedListing.condition.replace('-', ' ')}</p></div>
                <div><p className="text-xs text-slate-600">Status</p><p className="font-semibold text-ink">{selectedListing.isSold ? 'Sold' : 'Active'}</p></div>
                <div><p className="text-xs text-slate-600">Posted</p><p className="font-semibold text-ink">{new Date(selectedListing.createdAt).toLocaleString('en-GH')}</p></div>
                <div><p className="text-xs text-slate-600">Seller</p><p className="font-semibold text-ink">{selectedListing.seller.name}</p></div>
                <div><p className="text-xs text-slate-600">Seller contact</p><p className="font-semibold text-ink">{selectedListing.seller.phone || 'Not provided'}</p></div>
                <div><p className="text-xs text-slate-600">Location</p><p className="font-semibold text-ink">{selectedListing.location}</p></div>
                <div><p className="text-xs text-slate-600">Meetup spot</p><p className="font-semibold text-ink">{selectedListing.meetupSpot || 'Not specified'}</p></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink mb-1">Description</h3>
                <p className="text-sm text-ink-600 whitespace-pre-wrap">{selectedListing.description}</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
