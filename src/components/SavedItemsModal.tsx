'use client';

import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export const SavedItemsModal: React.FC = () => {
  const { 
    isSavedModalOpen, 
    closeSavedModal, 
    savedItems, 
    toggleSaveItem, 
    setActiveItem 
  } = useMarket();

  if (!isSavedModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-emerald-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Saved Items</h2>
              <p className="text-xs text-slate-500">Items you have bookmarked for later</p>
            </div>
          </div>

          <button
            onClick={closeSavedModal}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-3">
          {savedItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No saved items yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Browse campus listings and click the bookmark icon on items you are interested in.
              </p>
            </div>
          ) : (
            savedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  closeSavedModal();
                  setActiveItem(item);
                }}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'}
                    alt={item.title}
                    className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-emerald-700 font-extrabold mt-0.5">
                      GH₵ {item.price.toLocaleString()}{' '}
                      {item.isNegotiable && (
                        <span className="text-[10px] text-emerald-600 font-normal ml-1">
                          (Negotiable)
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.location} • {item.universityName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveItem(item.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
