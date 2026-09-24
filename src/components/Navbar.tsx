'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  PlusCircle, 
  Bookmark, 
  ShieldCheck, 
  Search, 
  MapPin, 
  Layers, 
  X,
  Menu,
  GraduationCap
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { UNIVERSITIES } from '@/data/universities';
import { UniversityId } from '@/types/market';

export const Navbar: React.FC = () => {
  const {
    filters,
    updateFilter,
    selectedUniversityId,
    setSelectedUniversityId,
    savedItemIds,
    myListings,
    openPostModal,
    openSavedModal,
    openMyListingsModal,
    openSafetyModal,
  } = useMarket();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedUni = UNIVERSITIES.find((u) => u.id === selectedUniversityId);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav shadow-xs">
      {/* Top micro-bar for university selection */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Campus Trading
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Buy & sell peer-to-peer across Ghana universities
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="campus-select" className="text-slate-400 flex items-center gap-1 cursor-pointer">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus:</span>
            </label>
            <select
              id="campus-select"
              value={selectedUniversityId}
              onChange={(e) => setSelectedUniversityId(e.target.value as UniversityId)}
              className="bg-slate-800 text-white text-xs font-semibold rounded-md px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">🇬🇭 All Universities in Ghana</option>
              {UNIVERSITIES.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name} ({uni.city})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Campus<span className="text-emerald-600">Mart</span>
              </span>
              <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-1.5 py-0.5 rounded tracking-wide uppercase border border-amber-200">
                Ghana
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {selectedUni ? `${selectedUni.shortName} Marketplace` : 'Student Peer-to-Peer Hub'}
            </p>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg items-center relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search laptops, mini-fridges, calculators, textbooks..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100/90 hover:bg-slate-100 focus:bg-white rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Safety Button */}
          <button
            onClick={openSafetyModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Campus Safety Tips"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safety Guide</span>
          </button>

          {/* Saved Items */}
          <button
            onClick={openSavedModal}
            className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Saved Items"
          >
            <Bookmark className="w-4 h-4 text-slate-500" />
            <span>Saved</span>
            {savedItemIds.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedItemIds.length}
              </span>
            )}
          </button>

          {/* My Listings */}
          <button
            onClick={openMyListingsModal}
            className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="My Posted Items"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>My Listings</span>
            {myListings.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                {myListings.length}
              </span>
            )}
          </button>

          {/* Post Item CTA Button */}
          <button
            onClick={openPostModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post an Item</span>
          </button>
        </div>

        {/* Mobile quick actions & toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={openPostModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (when expanded) */}
      <div className="md:hidden px-4 pb-2.5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search items on campus..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100 rounded-full border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-in fade-in duration-150">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openSafetyModal();
            }}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-700"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Campus Safety Tips
            </span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openSavedModal();
            }}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-700"
          >
            <span className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-slate-500" /> Saved Items
            </span>
            {savedItemIds.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                {savedItemIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openMyListingsModal();
            }}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-700"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" /> My Posted Items
            </span>
            {myListings.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold">
                {myListings.length}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
