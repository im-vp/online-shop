import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserState {
  isAuth: Promise<boolean> | boolean;
  setAuthStatus: (val: boolean) => void;
}

export const useUserStore = create<UserState>()(
  devtools((set) => ({
    isAuth: false,
    setAuthStatus: (status) => set(() => ({ isAuth: status })),
  })),
);
