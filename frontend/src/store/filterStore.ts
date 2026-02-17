/**
 * Filter Store
 * Manages shop page filters with persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  selectedCategory: string;
  selectedFinish: string[];
  selectedUsage: string[];
  priceRange: [number, number];
  sortBy: string;
  searchQuery: string;
  
  setCategory: (category: string) => void;
  setFinish: (finish: string[]) => void;
  toggleFinish: (finish: string) => void;
  setUsage: (usage: string[]) => void;
  toggleUsage: (usage: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const VALID_SORT_VALUES = ['createdAt_desc', 'price_asc', 'price_desc', 'name_asc', 'name_desc'] as const;

const initialState = {
  selectedCategory: '',
  selectedFinish: [],
  selectedUsage: [],
  priceRange: [0, 100000] as [number, number],
  sortBy: 'createdAt_desc' as string,
  searchQuery: '',
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCategory: (category) => set({ selectedCategory: category }),
      
      setFinish: (finish) => set({ selectedFinish: finish }),
      
      toggleFinish: (finish) =>
        set((state) => {
          const exists = state.selectedFinish.includes(finish);
          return {
            selectedFinish: exists
              ? state.selectedFinish.filter((f) => f !== finish)
              : [...state.selectedFinish, finish],
          };
        }),
      
      setUsage: (usage) => set({ selectedUsage: usage }),
      
      toggleUsage: (usage) =>
        set((state) => {
          const exists = state.selectedUsage.includes(usage);
          return {
            selectedUsage: exists
              ? state.selectedUsage.filter((u) => u !== usage)
              : [...state.selectedUsage, usage],
          };
        }),
      
      setPriceRange: (range) => set({ priceRange: range }),
      
      setSortBy: (sort) => set({ sortBy: sort }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      resetFilters: () => set(initialState),
    }),
    {
      name: 'pitalya-filters', // localStorage key
      version: 2, // Bump to invalidate stale persisted data
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          // Fix stale sortBy values from old versions
          if (!VALID_SORT_VALUES.includes(persistedState.sortBy)) {
            persistedState.sortBy = 'createdAt_desc';
          }
        }
        return persistedState;
      },
      partialize: (state) => ({
        // Only persist these fields
        selectedCategory: state.selectedCategory,
        selectedFinish: state.selectedFinish,
        selectedUsage: state.selectedUsage,
        priceRange: state.priceRange,
        sortBy: state.sortBy,
        // Don't persist searchQuery
      }),
    }
  )
);
