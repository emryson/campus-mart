'use client';

import React from 'react';
import { 
  MapPin, 
  Bookmark, 
  Camera, 
  CheckCircle, 
  Star,
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
  'good': 'Good',
  'fair': 'Fair',
};

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { setActiveItem, isItemSaved, toggleSaveItem } = useMarket();
  const saved = isItemSaved(item.id);

  const coverImage = item.images[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80';

  const openItem = () => setActiveItem(item);

  return (
    <div
      onClick={openItem}
      onPointerUp={openItem}
      onTouchEnd={openItem}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openItem();
        }
      }}
      role="button"
      tabIndex={0}
      className="group flex flex-col bg-white rounded-md overflow-hidden border border-hairline transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-manipulation select-none"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-well">
        <img
          src={coverImage}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Sold Overlay */}
        {item.isSold && (
          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center z-20">
            <span className="bg-danger text-white font-semibold text-sm px-4 py-1.5 rounded-sm">
              Sold Out
            </span>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveItem(item.id);
          }}
          onTouchEnd={(e) => e.stopPropagation()}
          className={`absolute top-2 right-2 w-11 h-11 rounded-full bg-white border border-hairline flex items-center justify-center text-ink transition-colors ${
            saved ? 'bg-primary text-white border-primary' : 'hover:bg-well'
          }`}
          title={saved ? 'Remove from saved' : 'Save item'}
          aria-label={saved ? 'Remove from saved' : 'Save item'}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-2 left-2 bg-white/95 px-2 py-0.5 rounded-sm text-[10px] text-ink font-semibold">
          {item.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        {/* Seller Info & Badge */}
        <div className="flex items-center gap-1.5 mb-2">
          {item.seller.avatarUrl ? (
            <img
              src={item.seller.avatarUrl}
              alt={item.seller.name}
              className="w-5 h-5 rounded-full object-cover border border-white"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center font-semibold text-[10px]">
              {item.seller.name.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-ink truncate">{item.seller.name}</span>
            <div className="flex items-center text-slate-500 text-[8px]">
              <Star className="w-3 h-3 fill-current" />
              <span>4.9</span>
            </div>
          </div>
          {item.seller.studentIdVerified && (
            <span className="ml-auto text-[8px] bg-success-bg text-success-text font-semibold px-2 py-0.5 rounded-full">Trusted</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-ink line-clamp-2 mb-1">
          {item.title}
        </h3>

        {/* Location & Time */}
        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-3">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{item.location}</span>
          <span className="ml-auto">Posted {Math.floor(Math.random() * 24) + 1}h ago</span>
        </div>

        {/* Price & WhatsApp CTA */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-subtle font-medium block">Price</span>
            <span className="text-sm font-semibold text-ink">
              GH₵ {item.price.toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openItem();
            }}
            onTouchEnd={(event) => {
              event.stopPropagation();
              openItem();
            }}
            className="wa-bg min-h-11 px-3 rounded-md flex items-center justify-center gap-1 text-white font-semibold text-xs active:scale-95 transition-colors"
          >
            <span className="hidden sm:inline">Message</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
