'use client';

import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  Check, 
  MapPin 
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { ItemCondition } from '@/types/market';
import { UNIVERSITIES } from '@/data/universities';

export const FilterToolbar: React.FC = () => {
  const { filters, updateFilter, resetFilters, filteredItems, selectedUniversityId } = useMarket();
  const [expanded, setExpanded] = useState(false);

  const selectedUni = UNIVERSITIES.find((u) => u.id === selectedUniversityId);

  const hasActiveFilters = 
    filters.category !== 'all' ||
    filters.negotiableOnly ||
    filters.condition !== 'all' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.locationQuery !== '' ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Results count & Quick Toggles */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-semibold text-slate-700">
              <span className="text-ink font-semibold text-sm">{filteredItems.length}</span>{' '}
              {filteredItems.length === 1 ? 'item available' : 'items available'}
            </span>

            {/* Quick Toggle: Negotiable Only */}
            <button
              onClick={() => updateFilter('negotiableOnly', !filters.negotiableOnly)}
              className={`flex min-h-11 sm:min-h-0 items-center gap-1.5 px-3 py-1 sm:py-0 rounded-sm text-xs font-semibold border transition-colors ${
                filters.negotiableOnly
                  ? 'bg-primary-soft text-primary border-primary'
                  : 'bg-white text-ink-600 border-hairline-strong hover:bg-well'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  filters.negotiableOnly ? 'border-primary bg-primary' : 'border-hairline-strong'
                }`}
              >
                {filters.negotiableOnly && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <span>Negotiable Only</span>
            </button>

            {/* Expand / Collapse Advanced Filters */}
            <button
              onClick={() => setExpanded(!expanded)}
              className={`flex min-h-11 sm:min-h-0 items-center gap-1.5 px-3 py-1 sm:py-0 rounded-sm text-xs font-semibold border transition-colors ${
                expanded
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-ink-600 border-hairline-strong hover:bg-well'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium underline underline-offset-2 ml-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all</span>
              </button>
            )}
          </div>

          {/* Right: Sort By */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <label htmlFor="sort-by-select" className="text-xs text-gray-500 font-medium">
              Sort:
            </label>
            <select
              id="sort-by-select"
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="min-w-0 flex-1 sm:flex-none text-xs font-semibold bg-white border border-hairline-strong rounded-sm px-2.5 py-1.5 text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-focus-halo cursor-pointer"
            >
              <option value="newest">Recently Posted</option>
              <option value="price-asc">Price: Low to High (GH₵)</option>
              <option value="price-desc">Price: High to Low (GH₵)</option>
              <option value="popular">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Expanded Filter Panel */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-150">
            {/* Price Range (in GH₵) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span>Price Range (GH₵)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min GH₵"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm px-2.5 py-1.5 border border-hairline-strong rounded-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-halo"
                />
                <span className="text-gray-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max GH₵"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm px-2.5 py-1.5 border border-hairline-strong rounded-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-halo"
                />
              </div>
            </div>

            {/* Condition Filter */}
            <div className="space-y-1.5">
              <label htmlFor="condition-select" className="text-sm font-medium text-ink">
                Item Condition
              </label>
              <select
                id="condition-select"
                value={filters.condition}
                onChange={(e) => updateFilter('condition', e.target.value as ItemCondition | 'all')}
                className="w-full text-sm px-2.5 py-1.5 border border-hairline-strong rounded-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-halo bg-white"
              >
                <option value="all">All Conditions</option>
                <option value="brand-new">Brand New (Unopened)</option>
                <option value="like-new">Like New (Mint)</option>
                <option value="good">Good (Lightly Used)</option>
                <option value="fair">Fair (Visible signs of use)</option>
              </select>
            </div>

            {/* Specific Hall / Hostel Filter */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Hostel / Campus Hall</span>
              </label>
              <input
                type="text"
                placeholder={selectedUni ? `e.g. ${selectedUni.popularHostels[0] || 'Hall'}` : 'e.g. Pentagon, TF, Brunei...'}
                value={filters.locationQuery}
                onChange={(e) => updateFilter('locationQuery', e.target.value)}
                className="w-full text-sm px-2.5 py-1.5 border border-hairline-strong rounded-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-halo"
              />
            </div>

            {/* Quick Location Pills */}
            {selectedUni && selectedUni.popularHostels.length > 0 && (
              <div className="space-y-1.5 sm:col-span-2 md:col-span-4">
                <span className="text-[11px] font-semibold text-slate-500">Popular on {selectedUni.shortName}:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedUni.popularHostels.slice(0, 6).map((hostel) => (
                    <button
                      key={hostel}
                      onClick={() => updateFilter('locationQuery', filters.locationQuery === hostel ? '' : hostel)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                        filters.locationQuery === hostel
                          ? 'bg-primary-soft text-on-primary-soft border-primary font-semibold'
                          : 'bg-white text-ink-600 border-hairline-strong hover:bg-well'
                      }`}
                    >
                      {hostel}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
