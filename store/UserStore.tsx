import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserProperties {
  isAuth: boolean;
  userFavorites: string[];
}

export interface UserState extends UserProperties {
  setAuthStatus: (val: boolean) => void;
  addUserFavorites: (productId: string | string[]) => void;
}

const initialState: UserProperties = {
  isAuth: false,
  userFavorites: [],
};

export const createUserStore = (initProps: Partial<UserProperties>) =>
  create<UserState>()(
    devtools((set, get) => ({
      ...initialState,
      ...initProps,
      setAuthStatus: (status) => set(() => ({ isAuth: status })),
      addUserFavorites: (favoritesId: string | string[]) => {
        if (Array.isArray(favoritesId)) {
          set({
            userFavorites: favoritesId,
          });
          return;
        }
        const isIdInArray = get().userFavorites.includes(favoritesId);

        if (isIdInArray) {
          set((state) => ({ userFavorites: state.userFavorites.filter((id) => id !== favoritesId) }));
        } else {
          set((state) => ({ userFavorites: [...state.userFavorites, favoritesId] }));
        }
      },
    })),
  );
