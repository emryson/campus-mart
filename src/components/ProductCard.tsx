'use client';

import React from 'react';
import { 
  MapPin, 
  Bookmark, 
  Camera, 
  CheckCircle, 
  Eye, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CampusItem } from '@/types/market';
import { useMarket } from '@/context/MarketContext';

interface ProductCardProps {
  item: CampusItem;
}

const CONDITION_LABELS = {
  'brand-new': 'Brand New',
  'like-new': 'Like New',
  'good': 'Good Condition',
  'fair': 'Fair Condition',
};

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { setActiveItem, isItemSaved, toggleSaveItem } = useMarket();
  const saved = isItemSaved(item.id);

  const coverImage = item.images[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80';

  return (
    <div
      onClick={() => setActiveItem(item)}
      onTouchEnd={() => setActiveItem(item)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveItem(item);
        }
      }}
      role="button"
      tabIndex={0}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative card-hover focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={coverImage}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            // Fallback if image fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Sold Overlay */}
        {item.isSold && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-rose-600 text-white font-black text-sm tracking-wider uppercase px-4 py-1.5 rounded-md shadow-lg transform -rotate-6">
              Sold Out
            </span>
          </div>
        )}

        {/* Top Badges: Photos count & Save button */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          {/* Photo Count badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-medium shadow-xs">
            <Camera className="w-3 h-3 text-slate-300" />
            <span>{item.images.length} {item.images.length === 1 ? 'photo' : 'photos'}</span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveItem(item.id);
            }}
            onTouchEnd={(e) => e.stopPropagation()}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
              saved
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 scale-105'
                : 'bg-white/90 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
            title={saved ? 'Remove from saved' : 'Save item'}
            aria-label={saved ? 'Remove from saved' : 'Save item'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Condition Tag */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-emerald-300 border border-slate-700/50">
            {CONDITION_LABELS[item.condition]}
          </span>
        </div>

        {/* University Pill */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-md text-slate-950 font-sans shadow-xs">
            {item.universityName.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {item.title}
          </h3>

          {/* Location on campus */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate font-medium">{item.location}</span>
          </div>
        </div>

        {/* Price & Negotiable Pill */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-emerald-700 font-extrabold text-lg sm:text-xl tracking-tight">
                GH₵ {item.price.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            {item.isNegotiable ? (
              <span className="inline-flex items-center text-[11px] font-bold px-2 py-1 rounded-full badge-negotiable">
                Negotiable
              </span>
            ) : (
              <span className="inline-flex items-center text-[11px] font-semibold px-2 py-1 rounded-full badge-fixed">
                Fixed Price
              </span>
            )}
          </div>
        </div>

        {/* Seller Info & Contact Preview */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 truncate">
            {item.seller.avatarUrl ? (
              <img
                src={item.seller.avatarUrl}
                alt={item.seller.name}
                className="w-5 h-5 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">
                {item.seller.name.charAt(0)}
              </div>
            )}
            <span className="truncate font-medium text-slate-700">{item.seller.name}</span>
            {item.seller.studentIdVerified && (
              <span title="Verified Campus Student">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveItem(item);
            }}
            className="min-h-10 flex-1 justify-center text-[11px] text-white bg-emerald-600 hover:bg-emerald-700 font-bold rounded-lg px-3 flex items-center gap-1 transition-colors"
          >
            View details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
