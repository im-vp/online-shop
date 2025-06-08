import { FC, useEffect } from 'react';

import { POPUP_ID } from '@/constants/constants';
import { useCartStore } from '@/hooks/store/useStore';
import { usePopupStore } from '@/store/PopupStore';

interface Props {}

const HeaderCartButton: FC<Props> = ({}) => {
  const { products, totalQuantity, isLoadingStatus, openCart } = useCartStore((state) => state);

  const togglePopup = usePopupStore((state) => state.togglePopup);

  useEffect(() => {
    isLoadingStatus === 'success' && togglePopup(POPUP_ID.cart);
  }, [isLoadingStatus]);

  return (
    <button
      type="button"
      title="Корзина"
      className="header__button icon-container header__button--cart"
      onClick={() => {
        products.length ? togglePopup(POPUP_ID.cart) : openCart();
      }}
    >
      {totalQuantity > 0 && <span className="header__button--cart-count">{totalQuantity}</span>}
    </button>
  );
};

export default HeaderCartButton;
