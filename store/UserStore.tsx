import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserProperties {
  isAuth: boolean;
}

export interface UserState extends UserProperties {
  setAuthStatus: (val: boolean) => void;
}

const initialState: UserProperties = {
  isAuth: false,
};

export const createUserStore = (initProps: Partial<UserProperties>) =>
  create<UserState>()(
    devtools((set) => ({
      ...initialState,
      ...initProps,
      setAuthStatus: (status) => set(() => ({ isAuth: status })),
    })),
  );
