'use client';

import React from 'react';
import { ShieldCheck, ArrowRight, MapPin, Smartphone, CheckCircle } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export const SafetyBanner: React.FC = () => {
  const { openSafetyModal } = useMarket();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 my-10">
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Campus Safe-Trading Promise</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              No Delivery Fees. No MoMo Scams. Trade In Person on Campus.
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Arrange meetups right outside your hall, hostel, or campus library. 
              Inspect the item, test electronics, and pay only when 100% satisfied.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={openSafetyModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98"
            >
              <span>Read Safety Checklist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 -mb-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>
    </div>
  );
};
