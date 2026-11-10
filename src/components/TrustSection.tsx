'use client';

import React from 'react';
import { GraduationCap, MapPin, HandMetal } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="border-t border-hairline py-6 mb-8">
      <div>
        <h2 className="text-lg font-semibold text-ink mb-4">Safe campus trading</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 shrink-0 rounded-sm bg-brand-soft flex items-center justify-center text-brand-dark">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-ink mb-1">Student community</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandatory signup with university email ensures you're trading with real classmates.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 shrink-0 rounded-sm bg-info-bg flex items-center justify-center text-info-text">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-ink mb-1">Hall meetups</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designated safe exchange spots at hostel entrances and campus security hubs.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 shrink-0 rounded-sm bg-well flex items-center justify-center text-primary">
              <HandMetal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-ink mb-1">Inspection first</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect your item before you pay. Direct P2P negotiation without middleman fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};