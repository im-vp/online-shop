'use client';

import { FC, createContext, useRef } from 'react';

import { createCartStore } from '@/store/CartStore';
import { createFavoritesStore } from '@/store/FavoritesStore';
import { createUserStore } from '@/store/UserStore';
import { ICategoriesResponse, IHeaderData } from '@/types/types';

interface Props {
  children: React.ReactNode;
  value: IHeaderData;
}

export const InitDataContext = createContext<{
  favoritesStore: ReturnType<typeof createFavoritesStore>;
  userStore: ReturnType<typeof createUserStore>;
  cartStore: ReturnType<typeof createCartStore>;
  categoriesInfo: ICategoriesResponse
} | null>(null);

const RootInitProvider: FC<Props> = ({ children, value }) => {
  const favoritesStoreRef = useRef(createFavoritesStore({ favorites: value.myFavorites || [] }));
  const userStoreRef = useRef(createUserStore({ isAuth: value.isAuth }));
  const cartStoreRef = useRef(
    createCartStore({
      totalQuantity: value.cartQuantity,
    }),
  );

  return (
    <InitDataContext.Provider
      value={{
        favoritesStore: favoritesStoreRef.current,
        userStore: userStoreRef.current,
        cartStore: cartStoreRef.current,
        categoriesInfo: value.categoriesInfo
      }}
    >
      {children}
    </InitDataContext.Provider>
  );
};

export default RootInitProvider;
