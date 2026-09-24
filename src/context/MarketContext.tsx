'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CampusItem, FilterState, UniversityId, ItemCategory, ItemCondition } from '@/types/market';
import { INITIAL_CAMPUS_ITEMS } from '@/data/mockItems';

interface MarketContextType {
  items: CampusItem[];
  savedItemIds: string[];
  filters: FilterState;
  activeItem: CampusItem | null;
  isPostModalOpen: boolean;
  isSavedModalOpen: boolean;
  isMyListingsModalOpen: boolean;
  isSafetyModalOpen: boolean;
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
  setActiveItem: (item: CampusItem | null) => void;
  addItem: (newItem: Omit<CampusItem, 'id' | 'createdAt' | 'views'>) => CampusItem;
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

const STORAGE_KEY_ITEMS = 'campus_mart_items_v2';
const STORAGE_KEY_SAVED = 'campus_mart_saved_v2';

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CampusItem[]>(INITIAL_CAMPUS_ITEMS);
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [activeItem, setActiveItem] = useState<CampusItem | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isMyListingsModalOpen, setIsMyListingsModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (storedItems) {
        const parsed = JSON.parse(storedItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
      const storedSaved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (storedSaved) {
        setSavedItemIds(JSON.parse(storedSaved));
      }
    } catch (err) {
      console.error('Failed to load CampusMart storage:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to persist items:', err);
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedItemIds));
    } catch (err) {
      console.error('Failed to persist saved items:', err);
    }
  }, [savedItemIds, isLoaded]);

  const openPostModal = () => setIsPostModalOpen(true);
  const closePostModal = () => setIsPostModalOpen(false);
  const openSavedModal = () => setIsSavedModalOpen(true);
  const closeSavedModal = () => setIsSavedModalOpen(false);
  const openMyListingsModal = () => setIsMyListingsModalOpen(true);
  const closeMyListingsModal = () => setIsMyListingsModalOpen(false);
  const openSafetyModal = () => setIsSafetyModalOpen(true);
  const closeSafetyModal = () => setIsSafetyModalOpen(false);

  const addItem = (itemData: Omit<CampusItem, 'id' | 'createdAt' | 'views'>): CampusItem => {
    const newItem: CampusItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      views: 1,
      isCustomUserPost: true,
      isSold: false,
    };

    setItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (activeItem?.id === id) setActiveItem(null);
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
        // Default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [items, filters]);

  const myListings = useMemo(() => {
    return items.filter((item) => item.isCustomUserPost);
  }, [items]);

  const savedItems = useMemo(() => {
    return items.filter((item) => savedItemIds.includes(item.id));
  }, [items, savedItemIds]);

  return (
    <MarketContext.Provider
      value={{
        items,
        savedItemIds,
        filters,
        activeItem,
        isPostModalOpen,
        isSavedModalOpen,
        isMyListingsModalOpen,
        isSafetyModalOpen,
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
