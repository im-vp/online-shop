'use client';

import React, { FC, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import CartButton from '@/components/elements/CartButton';
import FavoritesButton from '@/components/elements/FavoritesButton';
import Price from '@/components/elements/Price';
import Spinner from '@/components/ui/spinner/Spinner';

import { POPUP_ID, SPINNER_STYLE } from '@/constants/constants';
import { useCartStore } from '@/store/CartStore';
import { usePopupStore } from '@/store/PopupStore';
import { IProduct } from '@/types/types';

interface Props {
  product: IProduct;
}

const FavoritesItem: FC<Props> = ({ product }) => {
  const { _id, images, path, name, price } = product;
  const addToCart = useCartStore((state) => state.addToCart);
  const isLoading = useCartStore((state) => state.cart.isLoading);
  const togglePopup = usePopupStore((state) => state.togglePopup);

  useEffect(() => {
    !isLoading.status && togglePopup(POPUP_ID.cart);
  }, [isLoading]);

  return (
    <li className="favorites-item" key={_id}>
      <Link href={path} title={name} className="favorites-item__image">
        <Image src={images[0]} alt={name} width={100} height={100} />
      </Link>
      <div className="favorites-item__main">
        <Link href={path} title={name} className="favorites-item__name">
          {name}
        </Link>
        <Price className="favorites-item__price" price={price} />
        <div className="favorites-item__buttons">
          {isLoading.status && isLoading.productId === product._id ? (
            <Spinner color="#FFFFFF" css={SPINNER_STYLE.buttonAddCartWithText} />
          ) : (
            <CartButton
              text="В корзину"
              className="favorites-item__btn-cart"
              onClick={() => {
                addToCart(product._id);
              }}
            />
          )}
          <FavoritesButton productId={_id.toString()} favorites={[_id.toString()]} />
        </div>
      </div>
    </li>
  );
};

export default FavoritesItem;
