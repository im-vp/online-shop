'use client';

import { useEffect, useState } from 'react';

import { POPUP_ID } from '@/constants/constants';
import { useCartStore } from '@/hooks/store/useStore';
import { usePopupStore } from '@/store/PopupStore';

export const useAddToCart = () => {
  const { isLoadingStatus, isLoadingProductId, addToCart } = useCartStore((state) => state);

  const [idProduct, setIdProduct] = useState('');

  const [isCartLoading, setCartLoading] = useState(isLoadingStatus === 'loading');
  const [isAddToCartButtonLoading, setAddToCartButtonLoading] = useState(
    isLoadingStatus === 'loading' && isLoadingProductId.length && isLoadingProductId === idProduct,
  );

  const togglePopup = usePopupStore((state) => state.togglePopup);

  const addToCartHandler = (id: string) => {
    addToCart(id);
    setIdProduct(id);
  };

  const openCartHandler = () => {
    togglePopup(POPUP_ID.cart);
  };

  useEffect(() => {
    if (isLoadingStatus === 'success') {
      togglePopup(POPUP_ID.cart);
    }
    setCartLoading(isLoadingStatus === 'loading');
    setAddToCartButtonLoading(
      isLoadingStatus === 'loading' &&
        isLoadingProductId.length &&
        isLoadingProductId === idProduct,
    );
  }, [isLoadingStatus, isLoadingProductId]);

  return {
    isCartLoading,
    isAddToCartButtonLoading,
    isLoadingProductId,
    isLoadingStatus,
    addToCartHandler,
    openCartHandler,
  };
};
