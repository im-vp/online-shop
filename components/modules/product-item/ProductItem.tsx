'use client';

import { FC, use, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import CartButton from '@/components/elements/CartButton';
import FavoritesButton from '@/components/elements/FavoritesButton';
import Price from '@/components/elements/Price';
import { Rating } from '@/components/elements/Rating';
import Spinner from '@/components/ui/spinner/Spinner';

import { POPUP_ID, SPINNER_STYLE } from '@/constants/constants';
import { useCartStore } from '@/store/CartStore';
import { usePopupStore } from '@/store/PopupStore';
import style from '@/styles/product-item/product.module.css';
import { IProduct } from '@/types/types';

interface Props {
  className?: string;
  favorites?: string[] | null;
}

export const ProductItem: FC<IProduct & Props> = ({
  _id,
  name,
  slug,
  path,
  category,
  price,
  images,
  className = '',
  product_code,
  rating,
  favorites = [],
}) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const isLoading = useCartStore((state) => state.cart.isLoading);
  const togglePopup = usePopupStore((state) => state.togglePopup);

  useEffect(() => {
    isLoading.status === 'success' && togglePopup(POPUP_ID.cart);
  }, [isLoading]);

  return (
    <article className={`${style.product} ${className}`}>
      <Link className={style.product__link} href={path}>
        <div className={style.product__img}>
          <Image src={images[0]} alt={name} width={200} height={175} />
        </div>
        <h2 className={`product-title ${style.product__title}`}>{name}</h2>
      </Link>
      <FavoritesButton productId={_id} favorites={favorites} />
      <Rating value={rating.value} reviewCount={rating.reviewCount} />

      <div className={style.product__price}>
        <Price price={price} />
        {isLoading.status === 'loading' && isLoading.productId === _id ? (
          <Spinner color="#FFFFFF" css={SPINNER_STYLE.buttonAddCart} />
        ) : (
          <CartButton
            onClick={() => {
              addToCart(_id);
            }}
          />
        )}
      </div>
    </article>
  );
};
