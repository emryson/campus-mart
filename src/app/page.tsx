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
import { CampusStats } from '@/components/CampusStats';
import { TrustSection } from '@/components/TrustSection';
import { UNIVERSITIES } from '@/data/universities';

export default function Home() {
  const { 
    filteredItems, 
    resetFilters, 
    openPostModal, 
    selectedUniversityId, 
    filters,
    currentUser
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6 sm:py-8 pb-28 lg:pb-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-ink">
                {selectedUni ? `${selectedUni.name} Campus Market` : 'All Ghana Campus Listings'}
              </h2>
              <span className="bg-info-bg text-info-text text-xs font-semibold px-2 py-0.5 rounded-full">
                {filteredItems.length} items
              </span>
            </div>
            <p className="text-xs text-subtle mt-0.5">Campus listings and local meetups</p>
          </div>

          {/* Quick Post CTA */}
          <button
            onClick={openPostModal}
            className="self-start sm:self-auto flex min-h-11 sm:min-h-0 items-center gap-2 px-4 sm:h-8 bg-primary hover:bg-primary-hover text-white font-semibold text-xs rounded-md transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Post Your Item</span>
          </button>
        </div>

        {/* Product Grid or Empty State */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-md border border-hairline p-8 sm:p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-16 h-16 rounded-md bg-well text-subtle flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-ink">No items match your criteria</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We couldn't find any listings for your current filters in{' '}
                {selectedUni ? selectedUni.shortName : 'all universities'}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={resetFilters}
                className="w-full sm:w-auto min-h-11 sm:min-h-0 flex items-center justify-center gap-1.5 px-4 sm:h-8 text-xs font-semibold text-ink-600 bg-primary-soft hover:bg-well rounded-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>

              <button
                onClick={openPostModal}
                className="w-full sm:w-auto min-h-11 sm:min-h-0 flex items-center justify-center gap-1.5 px-4 sm:h-8 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-md transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post This Item</span>
              </button>
            </div>
          </div>
        )}

        {/* Safety Callout Banner */}
        <SafetyBanner />

        {/* Campus Stats Section */}
        <CampusStats />

        {/* Trust Section */}
        <TrustSection />
      </main>

      {/* Floating Action Button for Mobile */}
      {currentUser && (
        <div className="lg:hidden fixed bottom-5 right-5 z-40">
          <button
            onClick={openPostModal}
            className="flex min-h-11 items-center gap-2 px-4 bg-primary hover:bg-primary-hover text-white font-semibold text-xs rounded-md border border-primary-pressed active:scale-95 transition-transform"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Item</span>
          </button>
        </div>
      )}

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
