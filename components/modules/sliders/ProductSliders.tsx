'use client';

import { CSSProperties } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

import CartButton from '@/components/elements/CartButton';
import FavoritesButton from '@/components/elements/FavoritesButton';
import Price from '@/components/elements/Price';
import { Rating } from '@/components/elements/Rating';
import Spinner from '@/components/ui/spinner/Spinner';

import { SPINNER_STYLE } from '@/constants/constants';
import { useAddToCart } from '@/hooks/useAddToCart';
import style from '@/styles/sliders/productSliders.module.css';
import { IProduct } from '@/types/types';

export const ProductSliders = ({
  products,
  title,
  className = '',
  inlineStyle = {},
}: {
  products: IProduct[];
  title?: string;
  className?: string;
  inlineStyle?: CSSProperties;
}) => {
  const { addToCartHandler, isLoadingProductId } = useAddToCart();

  if (!products.length) return null;

  return (
    <section className={`${style.container} ${className}`} style={{ ...inlineStyle }}>
      {title && <h2 className={style.title}>{title}</h2>}

      <Slider className={style.slider} slidesToShow={products.length > 4 ? 4 : products.length}>
        {products.map((product) => (
          <section className={style.item} key={product._id}>
            <Link href={product.path} className={style.link}>
              <div className={style.img}>
                <Image src={product.images[0]} alt={product.name} width={200} height={175} />
              </div>
              <h3 className={`product-title ${style.name}`}>{product.name}</h3>
            </Link>
            <div className={style.top}>
              <Rating value={product.rating.value} reviewCount={product.rating.reviewCount} />
              <FavoritesButton productId={product._id} />
            </div>
            <div className={style.bottom}>
              <Price price={product.price} />
              {isLoadingProductId === product._id ? (
                <Spinner color="#FFFFFF" css={SPINNER_STYLE.buttonAddCart} />
              ) : (
                <CartButton
                  onClick={() => {
                    addToCartHandler(product._id);
                  }}
                />
              )}
            </div>
          </section>
        ))}
      </Slider>
    </section>
  );
};
