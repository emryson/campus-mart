'use client';

import React from 'react';
import { 
  Sparkles, 
  Laptop, 
  Refrigerator, 
  BookOpen, 
  Smartphone, 
  Shirt, 
  Armchair, 
  ShoppingBag, 
  Dumbbell, 
  HelpCircle 
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { ItemCategory } from '@/types/market';
import { CATEGORIES_LIST } from '@/data/universities';

const ICON_MAP = {
  Sparkles,
  Laptop,
  Refrigerator,
  BookOpen,
  Smartphone,
  Shirt,
  Armchair,
  ShoppingBag,
  Dumbbell,
  HelpCircle,
};

export const CategoryFilter: React.FC = () => {
  const { filters, updateFilter, items, selectedUniversityId } = useMarket();

  // Count items per category under current university filter
  const getCategoryCount = (categoryId: ItemCategory) => {
    return items.filter((item) => {
      const matchUni = selectedUniversityId === 'all' || item.universityId === selectedUniversityId;
      const matchCat = categoryId === 'all' || item.category === categoryId;
      return matchUni && matchCat;
    }).length;
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 px-4 sm:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES_LIST.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon as keyof typeof ICON_MAP] || Sparkles;
            const isSelected = filters.category === cat.id;
            const count = getCategoryCount(cat.id as ItemCategory);

            return (
              <button
                key={cat.id}
                onClick={() => updateFilter('category', cat.id as ItemCategory)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900 ring-offset-1'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-slate-800 text-emerald-300' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
