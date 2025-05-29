'use client';

import Cart from '@/components/modules/cart/Cart';
import Popup from '@/components/ui/popup/Popup';

import { POPUP_ID } from '@/constants/constants';

const CartPopup = () => {
  return (
    <Popup popupId={POPUP_ID.cart} maxWidth="large">
      <Cart />
    </Popup>
  );
};

export default CartPopup;
