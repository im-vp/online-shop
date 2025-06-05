import { FC, useContext, useEffect, useState } from 'react';

import { UserContext } from '@/components/modules/header/HeaderProvider';

import { POPUP_ID } from '@/constants/constants';
import { useCartStore } from '@/store/CartStore';
import { usePopupStore } from '@/store/PopupStore';

interface Props {}

const HeaderCartButton: FC<Props> = ({}) => {
  const { cartQuantity } = useContext(UserContext);
  const [totalQuantity, setTotalQuantity] = useState(cartQuantity);
 
  const {
    products,
    totalQuantity: totalQuantityState,
    isLoadingStatus,
    openCart,
    setTotalQuantity: setTotalQuantityState,
  } = useCartStore((state) => state);

  const togglePopup = usePopupStore((state) => state.togglePopup);

  useEffect(() => {
    setTotalQuantityState(cartQuantity);
  }, []);

  useEffect(() => {
    setTotalQuantity(totalQuantityState);
  }, [totalQuantityState]);

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
