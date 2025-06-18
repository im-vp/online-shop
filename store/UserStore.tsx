import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { IUserShort } from '@/types/user-types';

interface UserProperties {
  isAuth: boolean;
  profileInfo: IUserShort | null;
  userFavorites: string[];
}

export interface UserState extends UserProperties {
  setAuthStatus: (val: boolean) => void;
  addUserFavorites: (productId: string | string[]) => void;
  resetUserInfo: () => void;
}

const initialState: UserProperties = {
  isAuth: false,
  profileInfo: null,
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
          set((state) => ({
            userFavorites: state.userFavorites.filter((id) => id !== favoritesId),
          }));
        } else {
          set((state) => ({ userFavorites: [...state.userFavorites, favoritesId] }));
        }
      },
      resetUserInfo: () =>
        set({
          isAuth: false,
          profileInfo: null,
          userFavorites: [],
        }),
    })),
  );
