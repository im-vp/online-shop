import { useContext } from 'react';

import { useStore } from 'zustand';

import { InitDataContext } from '@/components/modules/providers/RootInitProvider';

import { CartState } from '@/store/CartStore';
import { FavoriteState } from '@/store/FavoritesStore';
import { UserState } from '@/store/UserStore';

export function useInitDataContext() {
  const context = useContext(InitDataContext);
  if (!context) throw new Error('InitDataContext.Provider is missing');
  return context;
}

export function useFavoritesStore<T>(selector: (state: FavoriteState) => T): T {
  const stores = useContext(InitDataContext);
  if (!stores) throw new Error('Missing RootStoresProvider');

  return useStore(stores.favoritesStore, selector);
}

export function useUserStore<T>(selector: (state: UserState) => T): T {
  const stores = useContext(InitDataContext);
  if (!stores) throw new Error('Missing RootStoresProvider');
  return useStore(stores.userStore, selector);
}

export function useCartStore<T>(selector: (state: CartState) => T): T {
  const stores = useContext(InitDataContext);
  if (!stores) throw new Error('Missing RootStoresProvider');
  return useStore(stores.cartStore, selector);
}
