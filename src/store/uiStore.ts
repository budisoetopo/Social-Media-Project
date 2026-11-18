import { create } from 'zustand';

interface UIState {
  isMobileFilterOpen: boolean;
  setMobileFilterOpen: (isOpen: boolean) => void;
  toggleMobileFilter: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileFilterOpen: false,
  setMobileFilterOpen: (isOpen) => set({ isMobileFilterOpen: isOpen }),
  toggleMobileFilter: () =>
    set((state) => ({ isMobileFilterOpen: !state.isMobileFilterOpen })),
}));
