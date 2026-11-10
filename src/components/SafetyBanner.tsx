'use client';

import React from 'react';
import { ShieldCheck, ArrowRight, MapPin, Smartphone, CheckCircle } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export const SafetyBanner: React.FC = () => {
  const { openSafetyModal } = useMarket();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 my-10">
      <div className="bg-white rounded-md p-5 sm:p-6 text-ink border border-hairline">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-brand-soft text-brand-dark text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-brand" />
              <span>Campus Safe-Trading Promise</span>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-ink">
              No Delivery Fees. No MoMo Scams. Trade In Person on Campus.
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Arrange meetups right outside your hall, hostel, or campus library. 
              Inspect the item, test electronics, and pay only when 100% satisfied.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={openSafetyModal}
              className="w-full sm:w-auto min-h-11 flex items-center justify-center gap-2 px-4 bg-primary-soft hover:bg-well text-on-primary-soft font-semibold text-xs sm:text-sm rounded-md transition-colors"
            >
              <span>Read Safety Checklist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
