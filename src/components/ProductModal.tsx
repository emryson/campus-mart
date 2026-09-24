'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bookmark, 
  CheckCircle, 
  ShieldAlert, 
  MessageSquare, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Calendar, 
  Eye, 
  AlertCircle,
  Sparkles,
  Trash2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { CampusItem } from '@/types/market';

export const ProductModal: React.FC = () => {
  const { 
    activeItem, 
    setActiveItem, 
    isItemSaved, 
    toggleSaveItem, 
    deleteItem, 
    toggleSoldStatus,
    openSafetyModal
  } = useMarket();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!activeItem) return null;

  const saved = isItemSaved(activeItem.id);
  const images = activeItem.images.length > 0 ? activeItem.images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // WhatsApp link with customized Ghanaian campus trade message
  const whatsappUrl = `https://wa.me/${activeItem.seller.whatsappNumber}?text=${encodeURIComponent(
    offerPrice
      ? `Hi ${activeItem.seller.name}! I saw your "${activeItem.title}" on CampusMart listed for GH₵ ${activeItem.price}. Would you consider GH₵ ${offerPrice}? Can we meet at ${activeItem.meetupSpot || activeItem.location}?`
      : `Hi ${activeItem.seller.name}! I saw your listing for "${activeItem.title}" on CampusMart (GH₵ ${activeItem.price}). Is it still available to inspect and buy on campus?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
              {activeItem.universityName}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Campus Marketplace Listing
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200/60 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Link copied!
              </span>
            )}

            {/* Save */}
            <button
              onClick={() => toggleSaveItem(activeItem.id)}
              className={`p-2 rounded-full transition-colors ${
                saved ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:bg-slate-200/60'
              }`}
              title={saved ? 'Remove from saved' : 'Save item'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={() => setActiveItem(null)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Image Gallery (Up to 5 photos) */}
            <div className="lg:col-span-7 space-y-3">
              {/* Main Photo Viewer */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                <img
                  src={images[activeImageIndex]}
                  alt={`${activeItem.title} - photo ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain sm:object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />

                {/* Sold Banner */}
                {activeItem.isSold && (
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-rose-600 text-white font-extrabold text-base tracking-widest uppercase px-6 py-2 rounded-lg shadow-xl transform -rotate-3">
                      This Item Is Sold
                    </span>
                  </div>
                )}

                {/* Next / Prev Image Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md flex items-center justify-center transition-transform active:scale-95"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md flex items-center justify-center transition-transform active:scale-95"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Photo indicator */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/70 backdrop-blur-md text-white text-xs font-semibold">
                  Photo {activeImageIndex + 1} of {images.length} (Max 5)
                </div>
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-102'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] text-white text-center py-0.2">
                          Cover
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Safety notice banner right below photos */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Ghana Campus Safety Protocol</p>
                  <p className="text-amber-800/90 leading-relaxed">
                    Always meet in a public campus location (e.g. Porters Lodge, Balme Library, Dining Hall). 
                    <strong> Never send MoMo advance deposits</strong> before testing the item.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Location, Description, Seller Contact */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {activeItem.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium capitalize">
                      {activeItem.category}
                    </span>
                    <span>•</span>
                    <span className="capitalize font-medium text-slate-600">
                      Condition: <strong>{activeItem.condition.replace('-', ' ')}</strong>
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-800 font-semibold block">Asking Price</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-tight">
                      GH₵ {activeItem.price.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    {activeItem.isNegotiable ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full badge-negotiable shadow-xs">
                        <Sparkles className="w-3 h-3 text-emerald-700" />
                        Price Negotiable
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full badge-fixed shadow-xs">
                        Fixed Price
                      </span>
                    )}
                  </div>
                </div>

                {/* Location on campus */}
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block">Campus Location</span>
                      <span className="text-slate-600">{activeItem.location}</span>
                    </div>
                  </div>

                  {activeItem.meetupSpot && (
                    <div className="flex items-start gap-2 pt-2 border-t border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800 block">Suggested Safe Meetup</span>
                        <span className="text-slate-600">{activeItem.meetupSpot}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 300-word Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800">Description</span>
                    <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {activeItem.wordCount} / 300 words
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl max-h-48 overflow-y-auto whitespace-pre-line">
                    {activeItem.description}
                  </p>
                </div>

                {/* Negotiate Offer Input (if negotiable) */}
                {activeItem.isNegotiable && (
                  <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-1.5">
                    <label className="text-xs font-bold text-amber-900 block">
                      Propose a Counter-Offer in GH₵:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">GH₵</span>
                        <input
                          type="number"
                          placeholder={`e.g. ${Math.round(activeItem.price * 0.85)}`}
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(e.target.value)}
                          className="w-full text-xs pl-11 pr-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <span className="text-[11px] text-amber-800">Applies to WhatsApp message</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Seller Information & Actions */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                {/* Seller mini profile */}
                <div className="flex items-center justify-between bg-slate-100/70 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    {activeItem.seller.avatarUrl ? (
                      <img
                        src={activeItem.seller.avatarUrl}
                        alt={activeItem.seller.name}
                        className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                        {activeItem.seller.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">{activeItem.seller.name}</span>
                        {activeItem.seller.studentIdVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Verified Student
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {activeItem.seller.hostelOrHall} • {activeItem.seller.university}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Contact Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  {/* Phone Call */}
                  <a
                    href={`tel:${activeItem.seller.phone}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call ({activeItem.seller.phone})</span>
                  </a>
                </div>

                {/* Manage if user is creator */}
                {activeItem.isCustomUserPost && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleSoldStatus(activeItem.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                        activeItem.isSold
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {activeItem.isSold ? 'Mark as Available' : 'Mark as Sold'}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this listing?')) {
                          deleteItem(activeItem.id);
                        }
                      }}
                      className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Listing</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
