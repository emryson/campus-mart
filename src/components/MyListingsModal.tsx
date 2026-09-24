'use client';

import React from 'react';
import { X, Layers, PlusCircle, Trash2, CheckCircle2, RefreshCw, Eye } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export const MyListingsModal: React.FC = () => {
  const { 
    isMyListingsModalOpen, 
    closeMyListingsModal, 
    myListings, 
    openPostModal,
    deleteItem, 
    toggleSoldStatus, 
    setActiveItem 
  } = useMarket();

  if (!isMyListingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">My Campus Listings</h2>
              <p className="text-xs text-slate-500">Items you have posted for sale on campus</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeMyListingsModal();
                openPostModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New</span>
            </button>

            <button
              onClick={closeMyListingsModal}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-3">
          {myListings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">You haven't posted any items yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Got a calculator, textbook, mini-fridge, or study lamp you no longer need? Post it in 60 seconds!
              </p>
              <button
                onClick={() => {
                  closeMyListingsModal();
                  openPostModal();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Your First Item</span>
              </button>
            </div>
          ) : (
            myListings.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all"
              >
                <div 
                  onClick={() => {
                    closeMyListingsModal();
                    setActiveItem(item);
                  }}
                  className="flex items-center gap-3 cursor-pointer min-w-0"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.isSold && (
                      <span className="absolute inset-0 bg-slate-900/70 text-[9px] font-black text-white flex items-center justify-center uppercase">
                        Sold
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate hover:text-emerald-700">
                        {item.title}
                      </h4>
                      {item.isSold ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                          Sold
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-700 font-extrabold mt-0.5">
                      GH₵ {item.price.toLocaleString()} •{' '}
                      <span className="font-medium text-slate-500">
                        {item.isNegotiable ? 'Negotiable' : 'Fixed'}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.location} • {item.wordCount} words
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-end">
                  {/* Toggle sold */}
                  <button
                    onClick={() => toggleSoldStatus(item.id)}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      item.isSold
                        ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                        : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    {item.isSold ? 'Mark Active' : 'Mark Sold'}
                  </button>

                  {/* View */}
                  <button
                    onClick={() => {
                      closeMyListingsModal();
                      setActiveItem(item);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                    title="View item"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (confirm('Delete this listing?')) {
                        deleteItem(item.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
