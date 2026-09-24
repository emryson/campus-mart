'use client';

import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, GraduationCap } from 'lucide-react';
import { UNIVERSITIES } from '@/data/universities';
import { useMarket } from '@/context/MarketContext';
import { UniversityId } from '@/types/market';

export const Footer: React.FC = () => {
  const { setSelectedUniversityId, openSafetyModal, openPostModal } = useMarket();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight">
                Campus<span className="text-emerald-400">Mart</span> Ghana
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Empowering Ghanaian university students to safely buy, sell, and trade electronics, dorm items, and textbooks peer-to-peer.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span>🇬🇭 Built for Ghana Campus Life</span>
            </div>
          </div>

          {/* Supported Universities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Campuses
              </h4>
              <span className="text-[10px] bg-slate-900 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-slate-800">
                {UNIVERSITIES.length} Campuses
              </span>
            </div>
            <ul className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {UNIVERSITIES.map((u) => (
                <li key={u.id}>
                  <button
                    onClick={() => {
                      setSelectedUniversityId(u.id);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors text-left text-[11px] block truncate w-full"
                    title={u.name}
                  >
                    {u.shortName} - {u.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Student Features
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={openPostModal} className="hover:text-emerald-400 transition-colors">
                  Sell an Item (Post for Free)
                </button>
              </li>
              <li>
                <button onClick={openSafetyModal} className="hover:text-emerald-400 transition-colors">
                  Campus Meetup Safety Guide
                </button>
              </li>
              <li>
                <span className="text-slate-500">Max 5 Photos per Listing</span>
              </li>
              <li>
                <span className="text-slate-500">Prices in Ghanaian Cedis (GH₵)</span>
              </li>
              <li>
                <span className="text-slate-500">Negotiable & Fixed Options</span>
              </li>
            </ul>
          </div>

          {/* Safety & Trust */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Safety Notice</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Always test calculators, laptops, and appliances in person. Meet at porters lodges or campus libraries. Never send money in advance.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} CampusMart Ghana. Peer-to-peer student marketplace.</p>
          <p className="flex items-center gap-1">
            Made for university students with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> in Ghana
          </p>
        </div>
      </div>
    </footer>
  );
};
