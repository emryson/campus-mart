'use client';

import React from 'react';
import { PlusCircle, ShieldCheck, MapPin, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { UNIVERSITIES } from '@/data/universities';

export const HeroBanner: React.FC = () => {
  const { openPostModal, openSafetyModal, selectedUniversityId } = useMarket();
  const currentUni = UNIVERSITIES.find((u) => u.id === selectedUniversityId);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white py-10 md:py-14 px-4 sm:px-8 border-b border-emerald-900/40">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-1/4 -mt-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Column: Headline & Subheadline */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Peer-to-Peer Marketplace</span>
              {currentUni && (
                <span className="bg-emerald-400/20 text-white px-2 py-0.5 rounded text-[11px]">
                  {currentUni.shortName}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Buy & Sell With Classmates,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Directly on Campus
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Find textbooks, dorm mini-fridges, laptops, study desks, and calculators from fellow students. 
              Priced in <strong className="text-white">Ghanaian Cedis (GH₵)</strong>, zero shipping delays, and safe meetups right at your hall or hostel.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={openPostModal}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>Sell an Item on Campus</span>
              </button>

              <button
                onClick={openSafetyModal}
                className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Safety & Meetup Guide</span>
              </button>
            </div>
          </div>

          {/* Right Column: Key Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto min-w-[300px]">
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                <Tag className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Prices in GH₵</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Fixed or Negotiable deals straight with students</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Hostel Meetups</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Pent, Brunei, TF, Casford, Jean Nelson & more</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">5 High-Res Photos</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Inspect item quality before contacting seller</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">WhatsApp & Call</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Instant direct chat with university peers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
