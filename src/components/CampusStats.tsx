'use client';

import React from 'react';
import { Users, ShoppingCart, MessageSquare } from 'lucide-react';

export const CampusStats: React.FC = () => {
  return (
    <div className="px-5 py-6 bg-[#1B3A57] text-white rounded-2xl mx-4 mb-6">
      <h3 className="text-lg font-bold mb-4">Campus Activity Today</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-extrabold text-[#E08856] mb-1">47</div>
          <p className="text-xs text-white/70">Active Listings</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold text-[#D4A574] mb-1">8</div>
          <p className="text-xs text-white/70">Trades Live</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold text-[#60a5fa] mb-1">156</div>
          <p className="text-xs text-white/70">Active Traders</p>
        </div>
      </div>
    </div>
  );
};