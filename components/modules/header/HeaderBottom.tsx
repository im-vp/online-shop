'use client';

import { FC, useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ProfileBlock from '@/components/modules/header/ProfileBlock';
import { Search } from '@/components/modules/header/Search';

import { isCurrentUrlMatch } from '@/lib/utils/utils';

import { POPUP_ID } from '@/constants/constants';
import { useCartStore } from '@/store/CartStore';
import { usePopupStore } from '@/store/PopupStore';
import { ICategories } from '@/types/types';

interface Props {
  categories: ICategories[];
  isAuth: boolean;
  isFavorites: string[] | null;
  cartQuantity: number;
}

const HeaderBottom: FC<Props> = ({ categories, isAuth, isFavorites, cartQuantity }) => {
  const {
    totalQuantity: totalQuantityState,
    isLoading,
    products,
  } = useCartStore((state) => state.cart);
  const openCart = useCartStore((state) => state.openCart);
  const setTotalQuantityState = useCartStore((state) => state.setTotalQuantity);

  const togglePopup = usePopupStore((state) => state.togglePopup);
  const path = usePathname();
  const [activeButton, setActiveButton] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showComponent, setShowComponent] = useState(isCurrentUrlMatch(path));
  const [totalQuantity, setTotalQuantity] = useState(cartQuantity);

  useEffect(() => {
    setTotalQuantityState(cartQuantity);
  }, []);

  useEffect(() => {
    setTotalQuantity(totalQuantityState);
  }, [totalQuantityState]);

  useEffect(() => {
    isLoading.status === 'success' && togglePopup(POPUP_ID.cart);
  }, [isLoading]);

  useEffect(() => {
    setShowOverlay(false);
    setActiveButton(false);

    setShowComponent(isCurrentUrlMatch(path));
  }, [path]);

  if (showComponent) return null;

  return (
    <div className="header__bottom">
      <div className="header__categories">
        <button
          type="button"
          className={`header__categories-button ${activeButton && 'active'}`}
          onClick={() => {
            setActiveButton((prev) => !prev);
            activeButton ? setShowOverlay(false) : setShowOverlay(true);
          }}
        >
          Категории
        </button>
      </div>
      <Search
        onFocus={(e) => {
          setShowOverlay(e);
          setActiveButton(false);
        }}
      />
      <div className="header__button-holder">
        <ProfileBlock isAuth={isAuth} isFavorites={isFavorites} />
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
      </div>
      {showOverlay && (
        <div
          className="header__overlay opacity-in"
          onClick={() => {
            setShowOverlay(false);
            setActiveButton(false);
          }}
        ></div>
      )}

      {activeButton && (
        <div className="header__categories-popup smoothly-down box-shadow-white">
          {categories.map((el) => (
            <div key={el._id} className="header__categories-popup-item">
              <Link href={`/${el.slug}`}>{el.name}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderBottom;
