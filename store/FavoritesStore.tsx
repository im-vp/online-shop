import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PopupState {
  favorites: string[];
  addFavorite: (productId: string) => void;
  addAllFavorites: (array: string[]) => void;
}

export const useFavoritesStore = create<PopupState>()(
  devtools((set, get) => ({
    favorites: [],
    addFavorite: (productId) => {
      const isIdInArray = get().favorites.includes(productId);

      if (isIdInArray) {
        set((state) => ({ favorites: state.favorites.filter((id) => id !== productId) }));
      } else {
        set((state) => ({ favorites: [...state.favorites, productId] }));
      }
    },
    addAllFavorites: (array) => set(() => ({ favorites: array })),
  })),
);
