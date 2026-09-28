'use client';

import React from 'react';
import { PlusCircle, ShieldCheck, MapPin, Tag, CheckCircle2, Star } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { UNIVERSITIES } from '@/data/universities';

export const HeroBanner: React.FC = () => {
  const { openPostModal, openSafetyModal, selectedUniversityId, currentUser } = useMarket();
  const currentUni = UNIVERSITIES.find((u) => u.id === selectedUniversityId);

  return (
    <section className="gh-gradient px-5 py-8 text-white relative overflow-hidden sm:px-8 sm:py-10 md:py-14">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80"
          alt="Campus students studying together"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B3A57]/90 to-[#2c4c6e]/90"></div>
      </div>

      {/* Subtle background glow effect */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#D4A574] opacity-10 rounded-full blur-3xl z-10"></div>
      <div className="absolute top-10 -left-10 w-48 h-48 bg-[#E08856] opacity-10 rounded-full blur-3xl z-10"></div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Column: Headline & Subheadline */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex max-w-full items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/20 text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A574]" />
              <span className="truncate">Zero Commission • Student Only</span>
              {currentUni && (
                <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px]">
                  {currentUni.shortName}
                </span>
              )}
            </div>

            <h1 className="headline text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              Trade Books. <br />
              Share Dorms. <br />
              <span className="text-[#D4A574]">Build Community.</span>
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl">
              The safest way to buy and sell on campus. Meet up at your hostel, pay after inspection. 
              Find textbooks, dorm mini-fridges, laptops, and calculators from fellow students.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {currentUser && (
                <button
                  onClick={openPostModal}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E08856] hover:bg-[#c97445] text-white font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Start Selling</span>
                </button>
              )}

              <button
                onClick={openSafetyModal}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl backdrop-blur-sm border border-white/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Browse All</span>
              </button>
            </div>
          </div>

          {/* Right Column: Key Feature Highlights */}
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[300px]">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-[#D4A574]/20 text-[#D4A574] flex items-center justify-center mb-2">
                <Tag className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Prices in GH₵</p>
              <p className="text-[11px] text-white/70 mt-0.5">Fixed or Negotiable deals straight with students</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-[#E08856]/20 text-[#E08856] flex items-center justify-center mb-2">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Hostel Meetups</p>
              <p className="text-[11px] text-white/70 mt-0.5">Pent, Brunei, TF, Casford, Jean Nelson & more</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">5 High-Res Photos</p>
              <p className="text-[11px] text-white/70 mt-0.5">Inspect item quality before contacting seller</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-[#60a5fa]/20 text-[#60a5fa] flex items-center justify-center mb-2">
                <Star className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Verified Students</p>
              <p className="text-[11px] text-white/70 mt-0.5">Trade with real classmates only</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
