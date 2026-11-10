'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlusCircle, 
  Bookmark, 
  ShieldCheck, 
  Search, 
  MapPin, 
  Layers, 
  X,
  Menu,
  GraduationCap,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  Moon,
  Sun
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
    currentUser,
    logout,
  } = useMarket();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('campus_mart_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const nextDarkMode = !darkMode;
    setDarkMode(nextDarkMode);
    localStorage.setItem('campus_mart_theme', nextDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', nextDarkMode);
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedUni = UNIVERSITIES.find((u) => u.id === selectedUniversityId);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav shadow-xs">
      {/* Top micro-bar for university selection */}
      <div className="bg-white text-slate-600 text-xs py-1.5 px-4 sm:px-8 border-b border-hairline">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 font-medium text-brand-dark">
              <span className="w-2 h-2 rounded-full bg-brand"></span>
              Live Campus Trading
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Buy & sell peer-to-peer across Ghana universities
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="campus-select" className="text-slate-600 flex items-center gap-1 cursor-pointer">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span>Campus:</span>
            </label>
            <select
              id="campus-select"
              value={selectedUniversityId}
              onChange={(e) => setSelectedUniversityId(e.target.value as UniversityId)}
              className="min-w-0 flex-1 sm:flex-none bg-white text-ink text-xs font-semibold rounded-sm px-2.5 py-1.5 border border-hairline-strong focus:outline-none focus:border-primary focus:ring-2 focus:ring-focus-halo cursor-pointer"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
            <Image src="/images/logo.png" alt="CampusMart logo" fill sizes="40px" className="object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="headline font-semibold text-xl sm:text-2xl text-ink">
                Campus<span className="text-brand-dark">Mart</span>
              </span>
              <span className="hidden sm:inline bg-info-bg text-info-text font-semibold text-[10px] px-1.5 py-0.5 rounded-sm border border-info-border">
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
            className="w-full pl-10 pr-9 py-2 text-sm bg-white hover:bg-well focus:bg-white rounded-sm border border-hairline-strong focus:border-primary focus:ring-2 focus:ring-focus-halo outline-none transition-colors placeholder:text-slate-500"
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
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-ink hover:bg-well rounded-sm transition-colors dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>

          {/* Safety Button */}
          <button
            onClick={openSafetyModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-brand-dark hover:bg-brand-soft rounded-sm transition-colors"
            title="Campus Safety Tips"
          >
            <ShieldCheck className="w-4 h-4 text-brand" />
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
            className="flex items-center gap-2 px-4 h-8 bg-primary hover:bg-primary-hover text-white font-semibold text-xs sm:text-sm rounded-md transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post an Item</span>
          </button>

          {/* Auth: Login / Profile */}
          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-hairline-strong hover:border-primary hover:bg-primary-soft transition-colors"
                title={currentUser.name}
              >
                <span className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center text-[11px] font-semibold uppercase flex-shrink-0">
                  {currentUser.name.charAt(0)}
                </span>
                <span className="text-xs font-semibold text-slate-700 max-w-[80px] truncate hidden xl:block">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">{currentUser.universityName}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-full border border-slate-200 hover:border-emerald-300 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile quick actions & toggle */}
        <div className="flex lg:hidden items-center gap-2">
          {currentUser && (
            <button
              onClick={openPostModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          )}

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
              toggleTheme();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            <span className="flex items-center gap-2">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

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

          {/* Mobile Auth */}
          <div className="border-t border-slate-200 pt-2 mt-1">
            {currentUser ? (
              <div>
                <div className="flex items-center gap-2.5 py-2">
                  <span className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold uppercase flex-shrink-0">
                    {currentUser.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-emerald-600 font-medium truncate">{currentUser.universityName}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 py-2 text-sm font-medium text-rose-600"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-2 py-2 text-sm font-bold text-emerald-700"
              >
                <LogIn className="w-4 h-4" /> Login / Create Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
