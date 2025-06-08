import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FavoritesProperties {
  favorites: string[];
}

export interface FavoriteState extends FavoritesProperties {
  addFavorite: (productId: string) => void;
  addAllFavorites: (array: string[]) => void;
}

const initialState: FavoritesProperties = {
  favorites: [],
};

export const createFavoritesStore = (initProps: Partial<FavoritesProperties>) =>
  create<FavoriteState>()(
    devtools((set, get) => ({
      ...initialState,
      ...initProps,
      addFavorite: (productId) => {
        const isIdInArray = get().favorites.includes(productId);

        if (isIdInArray) {
          set((state) => ({ favorites: state.favorites.filter((id) => id !== productId) }));
        } else {
          set((state) => ({ favorites: [...state.favorites, productId] }));
        }
      },
      addAllFavorites: (array) => set({ favorites: array }),
    })),
  );
