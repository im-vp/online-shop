'use client';

import React, { FC } from 'react';

import CartPopup from '@/components/modules/cart/CartPopup';

interface Props {
  children?: React.ReactNode;
}

const PopupWrapper: FC<Props> = ({ children }) => {
  return (
    <>
      <CartPopup />
      {children}
    </>
  );
};

export default PopupWrapper;
