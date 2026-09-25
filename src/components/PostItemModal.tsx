'use client';

import React, { useState, useRef, useId } from 'react';
import { 
  X, 
  UploadCloud, 
  Camera, 
  Trash2, 
  Sparkles, 
  Check, 
  AlertCircle, 
  MapPin, 
  Tag, 
  HelpCircle,
  FileText,
  Phone,
  User,
  CheckCircle2,
  Lock,
  Image as ImageIcon
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { UNIVERSITIES, CATEGORIES_LIST } from '@/data/universities';
import { UniversityId, ItemCategory, ItemCondition } from '@/types/market';

const MAX_PHOTOS = 5;
const MAX_WORDS = 300;

// Curated sample preset photos for students who want to test the form quickly
const SAMPLE_PRESET_PHOTOS = [
  { name: 'Casio Calculator', url: '/images/casio_calculator.jpg' },
  { name: 'Dorm Mini Fridge', url: '/images/dorm_mini_fridge.jpg' },
  { name: 'Student Laptop', url: '/images/student_laptop.jpg' },
  { name: 'Electric Kettle & Lamp', url: '/images/electric_kettle_lamp.jpg' },
  { name: 'Study Chair', url: 'https://images.unsplash.com/photo-1580481077195-c328ad4f323c?w=800&auto=format&fit=crop&q=80' },
  { name: 'Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
];

export const PostItemModal: React.FC = () => {
  const { 
    isPostModalOpen, 
    closePostModal, 
    addItem, 
    setActiveItem, 
    updateFilter,
    currentUser,
    openAuthModal
  } = useMarket();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [price, setPrice] = useState<string>('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [condition, setCondition] = useState<ItemCondition>('like-new');
  
  // Location States
  const [universityId, setUniversityId] = useState<UniversityId>(currentUser?.universityId || UNIVERSITIES[0].id);
  const [location, setLocation] = useState(currentUser?.hostelOrHall || '');
  const [meetupSpot, setMeetupSpot] = useState('');

  // Description & Word Count
  const [description, setDescription] = useState('');

  // Photos (Max 5)
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Seller info prefilled from authenticated student
  const [sellerName, setSellerName] = useState(currentUser?.name || '');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '');

  // Pre-fill from currentUser when currentUser or modal changes
  React.useEffect(() => {
    if (currentUser) {
      setSellerName(currentUser.name);
      setSellerPhone(currentUser.phone);
      setUniversityId(currentUser.universityId);
      if (!location) setLocation(currentUser.hostelOrHall);
    }
  }, [currentUser, isPostModalOpen]);

  // Validation & UI states
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Unique IDs for accessibility
  const titleId = useId();
  const categoryId = useId();
  const priceId = useId();
  const universitySelectId = useId();
  const locationId = useId();
  const meetupSpotId = useId();
  const descriptionId = useId();
  const sellerNameId = useId();
  const sellerPhoneId = useId();

  if (!isPostModalOpen) return null;

  // Exact word count calculator
  const countWords = (text: string): number => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  };

  const currentWordCount = countWords(description);
  const wordsRemaining = MAX_WORDS - currentWordCount;

  // Handle Description Change with Max 300 words enforcement
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const words = countWords(newText);
    
    // If within limit, update
    if (words <= MAX_WORDS) {
      setDescription(newText);
    } else {
      // If user pasted text exceeding 300 words, trim to exactly 300 words
      const wordsArray = newText.trim().split(/\s+/).filter(Boolean);
      const truncated = wordsArray.slice(0, MAX_WORDS).join(' ');
      setDescription(truncated);
    }
  };

  // Handle Photo Upload (Max 5)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = MAX_PHOTOS - photos.length;
    if (availableSlots <= 0) {
      setPhotoError(`Maximum of ${MAX_PHOTOS} photos reached.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    if (files.length > availableSlots) {
      setPhotoError(`You can only add up to ${MAX_PHOTOS} photos in total. Loaded ${availableSlots} photos.`);
    }

    // Convert each file to data URL
    filesToProcess.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setPhotoError('Please upload only image files (JPG, PNG, WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => {
            if (prev.length >= MAX_PHOTOS) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add Preset sample photo
  const handleAddPresetPhoto = (url: string) => {
    setPhotoError(null);
    if (photos.length >= MAX_PHOTOS) {
      setPhotoError(`Maximum of ${MAX_PHOTOS} photos reached.`);
      return;
    }
    setPhotos((prev) => [...prev, url]);
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoError(null);
  };

  // Move photo to cover (index 0)
  const handleMakeCover = (index: number) => {
    setPhotos((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  };

  const selectedUni = UNIVERSITIES.find((u) => u.id === universityId) || UNIVERSITIES[0];

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!currentUser) {
      setFormError('Please log in before posting an item.');
      openAuthModal('post_item');
      return;
    }

    // Form Validations
    if (!title.trim()) {
      setFormError('Please enter an item title.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please enter a valid price.');
      return;
    }

    if (!location.trim()) {
      setFormError('Please specify the campus location, hall, or hostel.');
      return;
    }

    if (!description.trim()) {
      setFormError('Please provide a description of the item.');
      return;
    }

    if (currentWordCount > MAX_WORDS) {
      setFormError(`Description exceeds maximum limit of ${MAX_WORDS} words.`);
      return;
    }

    if (photos.length === 0) {
      setFormError('Please add at least 1 photo of the item (up to 5 photos).');
      return;
    }

    if (!sellerName.trim()) {
      setFormError('Please enter your name as the seller.');
      return;
    }

    if (!sellerPhone.trim()) {
      setFormError('Please provide your Ghana phone/WhatsApp number.');
      return;
    }

    // Format WhatsApp number to Ghana 233 format
    let cleanPhone = sellerPhone.replace(/\D/g, '');
    let waNumber = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      waNumber = '233' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('233') && cleanPhone.length === 9) {
      waNumber = '233' + cleanPhone;
    }

    setIsSubmitting(true);

    const newItem = addItem({
      title: title.trim(),
      category,
      price: parsedPrice,
      isNegotiable,
      universityId,
      universityName: selectedUni.name,
      location: location.trim(),
      meetupSpot: meetupSpot.trim() || `${selectedUni.shortName} Campus Library or Porter's Lodge`,
      description: description.trim(),
      wordCount: currentWordCount,
      condition,
      images: photos,
      seller: {
        name: sellerName.trim(),
        phone: sellerPhone.trim(),
        whatsappNumber: waNumber,
        university: selectedUni.name,
        hostelOrHall: location.trim(),
        studentIdVerified: true,
        joinedDate: 'Joined Today',
      },
    });

    if (!newItem) {
      setIsSubmitting(false);
      setFormError('Please log in before posting an item.');
      openAuthModal('post_item');
      return;
    }

    setIsSubmitting(false);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
      closePostModal();
      setActiveItem(newItem);
      updateFilter('universityId', universityId);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div 
        className="relative bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h2 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2 min-w-0">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span className="truncate">Post an Item on Campus</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sell or trade with classmates • Up to 5 photos • Max 300 words
            </p>
          </div>

          <button
            onClick={closePostModal}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Overlay Toast */}
        {showSuccessToast && (
          <div className="absolute inset-0 z-30 bg-emerald-950/85 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/40">
              <Check className="w-8 h-8 text-white stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black mb-1">Listing Published!</h3>
            <p className="text-emerald-200 text-sm max-w-md">
              Your item is now live on CampusMart for students at {selectedUni.name} to discover.
            </p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          {formError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-semibold">{formError}</div>
            </div>
          )}

          {/* Section 1: Item Photos (Max 5 photos) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Item Photos</span>
                <span className="text-[11px] font-normal text-slate-500">
                  (Maximum 5 photos)
                </span>
              </label>

              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                photos.length === MAX_PHOTOS ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {photos.length} / {MAX_PHOTOS} photos
              </span>
            </div>

            {/* Photo preview cards */}
            <div className="grid grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
              {photos.map((photo, index) => (
                <div 
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 group shadow-xs"
                >
                  <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  
                  {/* Cover Badge */}
                  {index === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                      Cover
                    </span>
                  )}

                  {/* Hover Actions: Delete & Set as Cover */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1 text-center">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleMakeCover(index)}
                        className="text-[10px] font-bold text-white bg-slate-800/90 hover:bg-emerald-600 px-2 py-0.5 rounded transition-colors"
                      >
                        Make Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload Dropzone if less than 5 photos */}
              {photos.length < MAX_PHOTOS && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors group"
                >
                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 mb-1 transition-colors" />
                  <span className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-800">
                    Add Photo
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {MAX_PHOTOS - photos.length} left
                  </span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {photoError && (
              <p className="text-xs text-rose-600 font-medium">{photoError}</p>
            )}

            {/* Quick Demo Photo Presets for Easy Testing */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                ⚡ Quick demo? Click to attach realistic student item photos:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PRESET_PHOTOS.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => handleAddPresetPhoto(sample.url)}
                    disabled={photos.length >= MAX_PHOTOS}
                    className="text-[11px] px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-200 rounded-md text-slate-700 hover:text-emerald-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    + {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor={titleId} className="text-xs font-bold text-slate-800">
                Item Title <span className="text-rose-500">*</span>
              </label>
              <input
                id={titleId}
                type="text"
                placeholder="e.g. Casio fx-991EX Scientific Calculator, Galanz Mini Fridge"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={90}
                required
                className="w-full text-xs sm:text-sm px-3 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor={categoryId} className="text-xs font-bold text-slate-800">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id={categoryId}
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white font-medium"
              >
                {CATEGORIES_LIST.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3: Price & Negotiability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80">
            {/* Price in GH₵ */}
            <div className="space-y-1.5">
              <label htmlFor={priceId} className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Price <span className="text-rose-500">*</span></span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-extrabold text-emerald-700">
                  GH₵
                </span>
                <input
                  id={priceId}
                  type="number"
                  min="1"
                  step="any"
                  placeholder="e.g. 250"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full text-sm font-bold pl-12 pr-3 py-2.5 bg-white border border-emerald-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
            </div>

            {/* Negotiable Toggle */}
            <div className="space-y-1.5 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-800">
                Is this price negotiable? <span className="text-rose-500">*</span>
              </label>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsNegotiable(true)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    isNegotiable
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Yes, Negotiable</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsNegotiable(false)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    !isNegotiable
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>Fixed Price</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Item Condition */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              Condition <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'brand-new', label: 'Brand New', desc: 'Sealed / Unused' },
                { id: 'like-new', label: 'Like New', desc: 'Mint condition' },
                { id: 'good', label: 'Good', desc: 'Lightly used' },
                { id: 'fair', label: 'Fair', desc: 'Visible wear' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id as ItemCondition)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    condition === c.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold block">{c.label}</span>
                  <span className={`text-[10px] ${condition === c.id ? 'text-slate-300' : 'text-slate-500'}`}>
                    {c.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Campus Location */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Campus & Hostel Location</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* University Select */}
              <div className="space-y-1">
                <label htmlFor={universitySelectId} className="text-[11px] font-semibold text-slate-600">
                  Select University
                </label>
                <select
                  id={universitySelectId}
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value as UniversityId)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hall / Hostel */}
              <div className="space-y-1">
                <label htmlFor={locationId} className="text-[11px] font-semibold text-slate-600">
                  Hall / Hostel / Department <span className="text-rose-500">*</span>
                </label>
                <input
                  id={locationId}
                  type="text"
                  placeholder="e.g. Pentagon Block B, Brunei Hall, TF Hostel"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Quick Hall / Hostel tags from chosen University */}
            {selectedUni.popularHostels.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-medium">Quick suggestions for {selectedUni.shortName}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUni.popularHostels.slice(0, 5).map((hostel) => (
                    <button
                      key={hostel}
                      type="button"
                      onClick={() => setLocation(hostel)}
                      className="text-[10px] px-2 py-0.5 bg-white hover:bg-emerald-50 border border-slate-200 text-slate-600 rounded transition-colors"
                    >
                      {hostel}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meetup Spot */}
            <div className="space-y-1">
              <label htmlFor={meetupSpotId} className="text-[11px] font-semibold text-slate-600">
                Preferred Safe Meetup Spot
              </label>
              <input
                id={meetupSpotId}
                type="text"
                placeholder="e.g. Balme Library front steps, Porters Lodge, JCR, Central Cafeteria"
                value={meetupSpot}
                onChange={(e) => setMeetupSpot(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Section 6: Description (MAXIMUM 300 WORDS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={descriptionId} className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Description <span className="text-rose-500">*</span></span>
                <span className="text-[11px] font-normal text-slate-500">
                  (Maximum 300 words)
                </span>
              </label>

              {/* Live Word Count Indicator */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                    currentWordCount >= MAX_WORDS
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : currentWordCount >= 250
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {currentWordCount} / {MAX_WORDS} words
                </span>
              </div>
            </div>

            {/* Word count progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  currentWordCount >= MAX_WORDS
                    ? 'bg-rose-500'
                    : currentWordCount >= 250
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (currentWordCount / MAX_WORDS) * 100)}%` }}
              ></div>
            </div>

            <textarea
              id={descriptionId}
              rows={4}
              placeholder="Describe the condition, what is included (chargers, original box, accessories), why you are selling, and tests the buyer can perform before paying..."
              value={description}
              onChange={handleDescriptionChange}
              required
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none leading-relaxed transition-all"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{wordsRemaining} words remaining</span>
              {currentWordCount >= MAX_WORDS && (
                <span className="text-rose-600 font-bold">Word limit reached! (Max 300 words)</span>
              )}
            </div>
          </div>

          {/* Section 7: Student Seller Contact Information */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Student Seller Contact</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor={sellerNameId} className="text-[11px] font-semibold text-slate-600">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id={sellerNameId}
                  type="text"
                  placeholder="e.g. Kwame Mensah"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={sellerPhoneId} className="text-[11px] font-semibold text-slate-600">
                  Ghana Phone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id={sellerPhoneId}
                    type="tel"
                    placeholder="e.g. 0244123456 or +233..."
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    required
                    className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closePostModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Campus Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
