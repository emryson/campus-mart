'use client';

import React from 'react';
import { GraduationCap, MapPin, HandMetal } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="px-5 py-10 bg-[#1B3A57] text-white rounded-3xl mx-4 mb-8 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="headline text-2xl font-bold mb-6">
          Safe Campus <span className="text-[#D4A574]">Trading</span>
        </h2>
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#D4A574]/20 flex items-center justify-center text-[#D4A574]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Verified Students Only</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Mandatory signup with university email ensures you're trading with real classmates.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#E08856]/20 flex items-center justify-center text-[#E08856]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Hall Safe Meetups</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Designated safe exchange spots at hostel entrances and campus security hubs.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#60a5fa]/20 flex items-center justify-center text-[#60a5fa]">
              <HandMetal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Inspection First</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Inspect your item before you pay. Direct P2P negotiation without middleman fees.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A574]/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
    </section>
  );
};