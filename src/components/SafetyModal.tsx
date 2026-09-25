'use client';

import React from 'react';
import { X, ShieldCheck, AlertTriangle, MapPin, Smartphone, CheckCircle2, Lock } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export const SafetyModal: React.FC = () => {
  const { isSafetyModalOpen, closeSafetyModal } = useMarket();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-100 bg-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">Campus Trade Safety Guide</h2>
              <p className="text-xs text-emerald-300">Tips for secure student-to-student transactions in Ghana</p>
            </div>
          </div>

          <button
            onClick={closeSafetyModal}
            className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 text-slate-700 text-xs sm:text-sm">
          {/* Rule 1: Public Meetup */}
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">1. Meet in Busy Public Campus Spots</h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                Always meet during daytime hours in well-lit, public areas. Recommended spots: 
                <strong> Balme Library (UG), Brunei Complex (KNUST), Casford Porters Lodge (UCC), JCR areas, or Central Dining Halls</strong>. 
                Avoid meeting in private or off-campus locations alone.
              </p>
            </div>
          </div>

          {/* Rule 2: No Advance MoMo */}
          <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-200/80">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-amber-950 text-sm">2. Never Send MoMo Advance Deposits</h3>
              <p className="text-amber-900/90 leading-relaxed text-xs">
                Do not transfer Mobile Money (MTN MoMo, Telecel Cash, ATMoney) before meeting in person and seeing the product. 
                Legitimate student sellers on campus will always be happy to let you inspect the item first.
              </p>
            </div>
          </div>

          {/* Rule 3: Test electronics */}
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">3. Test Thoroughly Before Paying</h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                - <strong>Laptops & Phones:</strong> Test charging port, keyboard, Wi-Fi, camera, and ensure iCloud/Google Account is logged out.
                <br />- <strong>Calculators:</strong> Run self-diagnostics or test key equations.
                <br />- <strong>Appliances (Fridges, Kettles):</strong> Plug into a campus wall socket to verify heating/cooling.
              </p>
            </div>
          </div>

          {/* Rule 4: Student Verification */}
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">4. Verify Student Status</h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                Feel free to ask the seller or buyer for their student ID card or campus hostel affiliation. 
                Trading within your university community builds accountability and long-term trust.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={closeSafetyModal}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            I Understand, Got It
          </button>
        </div>
      </div>
    </div>
  );
};
