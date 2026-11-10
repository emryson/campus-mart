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
    <div className="w-full bg-white border-b border-hairline py-3 px-4 sm:px-8">
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
                className={`flex min-h-11 sm:min-h-0 items-center gap-2 px-3.5 sm:py-1 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors duration-150 shrink-0 border ${
                  isSelected
                    ? 'bg-primary-soft text-on-primary-soft border-primary'
                    : 'bg-white hover:bg-well text-ink-600 border-hairline-strong'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-primary-soft text-primary' : 'bg-well text-slate-600'
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
