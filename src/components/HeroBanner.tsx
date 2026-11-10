'use client';

import React from 'react';
import { PlusCircle, ShieldCheck } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { UNIVERSITIES } from '@/data/universities';

export const HeroBanner: React.FC = () => {
  const { openPostModal, openSafetyModal, selectedUniversityId, currentUser } = useMarket();
  const currentUni = UNIVERSITIES.find((u) => u.id === selectedUniversityId);

  return (
    <section className="bg-white border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold text-ink">Campus goods, traded locally</h1>
          <p className="mt-1 text-sm text-slate-500">
            {currentUni ? `${currentUni.name} listings` : 'Listings from universities across Ghana'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {currentUser && (
            <button
              onClick={openPostModal}
              className="flex min-h-11 sm:min-h-0 items-center justify-center gap-2 px-4 sm:h-8 bg-primary hover:bg-primary-hover text-white font-semibold text-xs rounded-md transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post an item</span>
            </button>
          )}
          <button
            onClick={openSafetyModal}
            className="flex min-h-11 sm:min-h-0 items-center justify-center gap-2 px-4 sm:h-8 bg-primary-soft hover:bg-well text-ink-600 font-semibold text-xs rounded-md transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Safety guide</span>
          </button>
        </div>
      </div>
    </section>
  );
};
