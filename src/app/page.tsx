'use client';

import React from 'react';
import { 
  Sparkles, 
  Search, 
  PlusCircle, 
  RotateCcw, 
  PackageOpen, 
  Filter,
  GraduationCap
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryFilter } from '@/components/CategoryFilter';
import { FilterToolbar } from '@/components/FilterToolbar';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { PostItemModal } from '@/components/PostItemModal';
import { SavedItemsModal } from '@/components/SavedItemsModal';
import { MyListingsModal } from '@/components/MyListingsModal';
import { SafetyModal } from '@/components/SafetyModal';
import { SafetyBanner } from '@/components/SafetyBanner';
import { Footer } from '@/components/Footer';
import { UNIVERSITIES } from '@/data/universities';

export default function Home() {
  const { 
    filteredItems, 
    resetFilters, 
    openPostModal, 
    selectedUniversityId, 
    filters 
  } = useMarket();

  const selectedUni = UNIVERSITIES.find((u) => u.id === selectedUniversityId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Pills Bar */}
      <CategoryFilter />

      {/* Filter & Sort Toolbar */}
      <FilterToolbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedUni ? `${selectedUni.name} Campus Market` : 'All Ghana Campus Listings'}
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {filteredItems.length} items
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified student-to-student listings • Inspected and traded directly on campus
            </p>
          </div>

          {/* Quick Post CTA */}
          <button
            onClick={openPostModal}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Post Your Item</span>
          </button>
        </div>

        {/* Product Grid or Empty State */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">No items match your criteria</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We couldn't find any listings for your current filters in{' '}
                {selectedUni ? selectedUni.shortName : 'all universities'}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={resetFilters}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>

              <button
                onClick={openPostModal}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post This Item</span>
              </button>
            </div>
          </div>
        )}

        {/* Safety Callout Banner */}
        <SafetyBanner />
      </main>

      {/* Floating Action Button for Mobile */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={openPostModal}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-full shadow-xl shadow-emerald-900/30 border border-emerald-400/40 active:scale-95 transition-transform"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Item</span>
        </button>
      </div>

      {/* All Application Modals */}
      <ProductModal />
      <PostItemModal />
      <SavedItemsModal />
      <MyListingsModal />
      <SafetyModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}
