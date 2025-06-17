'use client';

import { useEffect } from 'react';

import { POPUP_ID } from '@/constants/constants';
import { useCartStore } from '@/hooks/store/useStore';
import { usePopupStore } from '@/store/PopupStore';

export const useAddToCart = (productId: string = 'cart') => {
  const isLoadingProduct = useCartStore((state) => state.loadingProductIdMap[productId] ?? false),
    addToCart = useCartStore((state) => state.addToCart),
    openCart = useCartStore((state) => state.openCart),
    hasProducts = useCartStore((state) => state.products.length > 0);

  const isLoading = isLoadingProduct === 'loading';

  const togglePopup = usePopupStore((state) => state.togglePopup);

  const addToCartHandler = (id: string) => {
    addToCart(id);
  };

  const openCartHandler = () => {
    hasProducts ? togglePopup(POPUP_ID.cart) : openCart();
  };

  useEffect(() => {
    if (isLoadingProduct === 'success') {
      togglePopup(POPUP_ID.cart);
    }
  }, [isLoadingProduct]);

  return {
    isLoading,
    addToCartHandler,
    openCartHandler,
  };
};
