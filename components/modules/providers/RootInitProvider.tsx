'use client';

import { FC, createContext, useRef } from 'react';

import { createCartStore } from '@/store/CartStore';
import { createUserStore } from '@/store/UserStore';
import { ICategoriesResponse, IHeaderData } from '@/types/types';

interface Props {
  children: React.ReactNode;
  value: IHeaderData;
}

export const InitDataContext = createContext<{
  userStore: ReturnType<typeof createUserStore>;
  cartStore: ReturnType<typeof createCartStore>;
  categoriesInfo: ICategoriesResponse;
} | null>(null);

const RootInitProvider: FC<Props> = ({ children, value }) => {
  const userStoreRef = useRef(
    createUserStore({
      isAuth: value.isAuth,
      userFavorites: value.myFavorites || [],
      profileInfo: value.userProfile || null,
    }),
  );
  const cartStoreRef = useRef(
    createCartStore({
      totalQuantity: value.cartQuantity,
    }),
  );

  return (
    <InitDataContext.Provider
      value={{
        userStore: userStoreRef.current,
        cartStore: cartStoreRef.current,
        categoriesInfo: value.categoriesInfo,
      }}
    >
      {children}
    </InitDataContext.Provider>
  );
};

export default RootInitProvider;
