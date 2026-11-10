'use client';

import React from 'react';
import { Users, ShoppingCart, MessageSquare } from 'lucide-react';

export const CampusStats: React.FC = () => {
  return (
    <section className="border-y border-hairline py-5 mb-6">
      <h3 className="text-sm font-semibold text-ink mb-4">Campus activity today</h3>
      <div className="grid grid-cols-3 divide-x divide-hairline">
        <div className="text-center px-2">
          <div className="text-2xl font-semibold text-ink mb-1">47</div>
          <p className="text-xs text-slate-600">Active listings</p>
        </div>
        <div className="text-center px-2">
          <div className="text-2xl font-semibold text-ink mb-1">8</div>
          <p className="text-xs text-slate-600">Trades live</p>
        </div>
        <div className="text-center px-2">
          <div className="text-2xl font-semibold text-ink mb-1">156</div>
          <p className="text-xs text-slate-600">Active traders</p>
        </div>
      </div>
    </section>
  );
};