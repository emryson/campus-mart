'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CampusItem, FilterState, UniversityId, ItemCategory, ItemCondition, StudentUser } from '@/types/market';
import { INITIAL_CAMPUS_ITEMS } from '@/data/mockItems';
import { UNIVERSITIES } from '@/data/universities';

interface MarketContextType {
  items: CampusItem[];
  savedItemIds: string[];
  filters: FilterState;
  activeItem: CampusItem | null;
  currentUser: StudentUser | null;
  isPostModalOpen: boolean;
  isSavedModalOpen: boolean;
  isMyListingsModalOpen: boolean;
  isSafetyModalOpen: boolean;
  isAuthModalOpen: boolean;
  filteredItems: CampusItem[];
  myListings: CampusItem[];
  savedItems: CampusItem[];
  openPostModal: () => void;
  closePostModal: () => void;
  openSavedModal: () => void;
  closeSavedModal: () => void;
  openMyListingsModal: () => void;
  closeMyListingsModal: () => void;
  openSafetyModal: () => void;
  closeSafetyModal: () => void;
  openAuthModal: (actionAfterAuth?: 'post_item') => void;
  closeAuthModal: () => void;
  login: (schoolId: string, username: string, password: string) => Promise<AuthResult>;
  loginAsAdmin: (username: string, password: string) => Promise<AuthResult>;
  signup: (userData: Omit<StudentUser, 'id' | 'createdAt' | 'isVerified' | 'role'> & { password: string }) => Promise<AuthResult>;
  logout: () => void;
  setActiveItem: (item: CampusItem | null) => void;
  addItem: (newItem: Omit<CampusItem, 'id' | 'createdAt' | 'views'>) => CampusItem | null;
  deleteItem: (id: string) => void;
  toggleSoldStatus: (id: string) => void;
  toggleSaveItem: (id: string) => void;
  isItemSaved: (id: string) => boolean;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  selectedUniversityId: UniversityId;
  setSelectedUniversityId: (id: UniversityId) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  universityId: 'all',
  locationQuery: '',
  minPrice: '',
  maxPrice: '',
  negotiableOnly: false,
  condition: 'all',
  sortBy: 'newest',
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const STORAGE_KEY_SAVED = 'campus_mart_saved_v2';

interface AuthResult {
  success: boolean;
  user?: StudentUser;
  error?: string;
}

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CampusItem[]>(INITIAL_CAMPUS_ITEMS);
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [activeItem, setActiveItem] = useState<CampusItem | null>(null);
  
  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isMyListingsModalOpen, setIsMyListingsModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'post_item' | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load local marketplace preferences and the server-backed session.
  useEffect(() => {
    const loadState = async () => {
    try {
      const storedSaved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (storedSaved) {
        setSavedItemIds(JSON.parse(storedSaved));
      }

      const listingsResponse = await fetch('/api/listings', { cache: 'no-store' });
      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json();
        if (Array.isArray(listingsData.listings) && listingsData.listings.length > 0) {
          setItems(listingsData.listings);
        }
      }

      const sessionResponse = await fetch('/api/auth/me', { cache: 'no-store' });
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        setCurrentUser(sessionData.user || null);
      }
    } catch (err) {
      console.error('Failed to load CampusMart storage:', err);
    } finally {
      setIsLoaded(true);
    }
    };

    void loadState();
  }, []);

  // Save saved IDs
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedItemIds));
    } catch (err) {
      console.error('Failed to persist saved items:', err);
    }
  }, [savedItemIds, isLoaded]);

  // Post modal guard: ONLY available for logged in users
  const openPostModal = () => {
    if (!currentUser) {
      setPendingAction('post_item');
      setIsAuthModalOpen(true);
      return;
    }
    setIsPostModalOpen(true);
  };

  const closePostModal = () => setIsPostModalOpen(false);
  const openSavedModal = () => setIsSavedModalOpen(true);
  const closeSavedModal = () => setIsSavedModalOpen(false);
  const openMyListingsModal = () => setIsMyListingsModalOpen(true);
  const closeMyListingsModal = () => setIsMyListingsModalOpen(false);
  const openSafetyModal = () => setIsSafetyModalOpen(true);
  const closeSafetyModal = () => setIsSafetyModalOpen(false);

  const openAuthModal = (actionAfterAuth?: 'post_item') => {
    if (actionAfterAuth) setPendingAction(actionAfterAuth);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const login = async (schoolId: string, username: string, password: string): Promise<AuthResult> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId, username, password }),
    });
    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error || 'Unable to sign in.' };

    setCurrentUser(result.user);
    setIsAuthModalOpen(false);
    if (pendingAction === 'post_item') {
      setPendingAction(null);
      setTimeout(() => setIsPostModalOpen(true), 150);
    }
    return { success: true, user: result.user };
  };

  const loginAsAdmin = async (username: string, password: string): Promise<AuthResult> => {
    const response = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error || 'Unable to sign in as admin.' };
    setCurrentUser(result.user);
    return { success: true, user: result.user };
  };

  const signup = async (userData: Omit<StudentUser, 'id' | 'createdAt' | 'isVerified' | 'role'> & { password: string }): Promise<AuthResult> => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error || 'Unable to create account.' };

    setCurrentUser(result.user);
    setIsAuthModalOpen(false);
    if (pendingAction === 'post_item') {
      setPendingAction(null);
      setTimeout(() => setIsPostModalOpen(true), 150);
    }
    return { success: true, user: result.user };
  };

  const logout = () => {
    void fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    setIsPostModalOpen(false);
  };

  const recordActivity = (type: string, metadata: Record<string, unknown> = {}) => {
    if (!currentUser) return;
    void fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, metadata }),
    });
  };

  const addItem = (itemData: Omit<CampusItem, 'id' | 'createdAt' | 'views'>): CampusItem | null => {
    if (!currentUser) {
      return null;
    }

    const newItem: CampusItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      views: 1,
      isCustomUserPost: true,
      ownerId: currentUser.id,
      isSold: false,
    };

    setItems((prev) => [newItem, ...prev]);

    void fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newItem,
        seller: newItem.seller,
        price: newItem.price,
        isNegotiable: newItem.isNegotiable,
        universityId: newItem.universityId,
        universityName: newItem.universityName,
        meetupSpot: newItem.meetupSpot,
        sellerName: newItem.seller.name,
        sellerPhone: newItem.seller.phone,
        sellerWhatsappNumber: newItem.seller.whatsappNumber,
        sellerUniversity: newItem.seller.university,
        sellerHostelOrHall: newItem.seller.hostelOrHall,
        sellerRoomOrSpot: newItem.seller.roomOrSpot,
        sellerStudentIdVerified: newItem.seller.studentIdVerified,
        sellerAvatarUrl: newItem.seller.avatarUrl,
      }),
    }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to save listing.');
      }

      setItems((prev) => [payload.listing, ...prev.filter((listing) => listing.id !== newItem.id)]);
      recordActivity('listing_created', { itemId: payload.listing.id, category: payload.listing.category });
    }).catch((error) => {
      console.error('Failed to create listing on server:', error);
    });

    return newItem;
  };

  const deleteItem = (id: string) => {
    if (!currentUser) return;
    if (currentUser.role !== 'admin') {
      const item = items.find((listing) => listing.id === id);
      if (!item || item.ownerId !== currentUser.id) return;
    }
    void fetch(`/api/listings/${encodeURIComponent(id)}/delete`, { method: 'POST' }).then((response) => {
      if (!response.ok) throw new Error('Listing deletion was not authorized');
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (activeItem?.id === id) setActiveItem(null);
    }).catch((error) => {
      console.error('Failed to delete listing:', error);
    });
  };

  const toggleSoldStatus = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isSold: !i.isSold } : i))
    );
    if (activeItem?.id === id) {
      setActiveItem((prev) => (prev ? { ...prev, isSold: !prev.isSold } : null));
    }
  };

  const toggleSaveItem = (id: string) => {
    setSavedItemIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
    recordActivity('saved_item_toggled', { itemId: id });
  };

  const isItemSaved = (id: string) => savedItemIds.includes(id);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const selectedUniversityId = filters.universityId;
  const setSelectedUniversityId = (id: UniversityId) => {
    updateFilter('universityId', id);
  };

  // Filtered Items computation
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // University filter
        if (filters.universityId !== 'all' && item.universityId !== filters.universityId) {
          return false;
        }

        // Category filter
        if (filters.category !== 'all' && item.category !== filters.category) {
          return false;
        }

        // Negotiable only
        if (filters.negotiableOnly && !item.isNegotiable) {
          return false;
        }

        // Condition
        if (filters.condition !== 'all' && item.condition !== filters.condition) {
          return false;
        }

        // Min price
        if (filters.minPrice !== '' && item.price < Number(filters.minPrice)) {
          return false;
        }

        // Max price
        if (filters.maxPrice !== '' && item.price > Number(filters.maxPrice)) {
          return false;
        }

        // Search Query (title, description, location)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          const matchUni = item.universityName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc && !matchUni) {
            return false;
          }
        }

        // Location specific query
        if (filters.locationQuery.trim()) {
          const loc = filters.locationQuery.toLowerCase().trim();
          if (!item.location.toLowerCase().includes(loc)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'popular') return (b.views || 0) - (a.views || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [items, filters]);

  const myListings = useMemo(() => {
    if (!currentUser) return [];
    return items.filter((item) =>
      item.isCustomUserPost && (currentUser.role === 'admin' || item.ownerId === currentUser.id)
    );
  }, [items, currentUser]);

  const savedItems = useMemo(() => {
    return items.filter((item) => savedItemIds.includes(item.id));
  }, [items, savedItemIds]);

  return (
    <MarketContext.Provider
      value={{
        items,
        savedItemIds,
        currentUser,
        filters,
        activeItem,
        isPostModalOpen,
        isSavedModalOpen,
        isMyListingsModalOpen,
        isSafetyModalOpen,
        isAuthModalOpen,
        filteredItems,
        myListings,
        savedItems,
        openPostModal,
        closePostModal,
        openSavedModal,
        closeSavedModal,
        openMyListingsModal,
        closeMyListingsModal,
        openSafetyModal,
        closeSafetyModal,
        openAuthModal,
        closeAuthModal,
        login,
        loginAsAdmin,
        signup,
        logout,
        setActiveItem,
        addItem,
        deleteItem,
        toggleSoldStatus,
        toggleSaveItem,
        isItemSaved,
        updateFilter,
        resetFilters,
        selectedUniversityId,
        setSelectedUniversityId,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
