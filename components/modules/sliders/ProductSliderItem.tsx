import { FC, memo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import CartButton from '@/components/elements/CartButton';
import FavoritesButton from '@/components/elements/FavoritesButton';
import Price from '@/components/elements/Price';
import { Rating } from '@/components/elements/Rating';
import Spinner from '@/components/ui/spinner/Spinner';

import { SPINNER_STYLE } from '@/constants/constants';
import { useAddToCart } from '@/hooks/useAddToCart';
import style from '@/styles/sliders/productSliders.module.css';
import { IProduct } from '@/types/types';

interface Props {
  product: IProduct;
}

export const ProductSliderItem: FC<Props> = memo(
  ({ product }) => {
    const { _id, name, path, images, price, rating } = product;
    const { isLoading, addToCartHandler } = useAddToCart(_id);

    return (
      <section className={style.item}>
        <Link href={path} className={style.link}>
          <div className={style.img}>
            <Image src={images[0]} alt={name} width={200} height={175} />
          </div>
          <h3 className={`product-title ${style.name}`}>{name}</h3>
        </Link>
        <div className={style.top}>
          <Rating value={rating.value} reviewCount={rating.reviewCount} />
          <FavoritesButton productId={_id} />
        </div>
        <div className={style.bottom}>
          <Price price={price} />
          {isLoading ? (
            <Spinner color="#FFFFFF" css={SPINNER_STYLE.buttonAddCart} />
          ) : (
            <CartButton
              onClick={() => {
                addToCartHandler(_id);
              }}
            />
          )}
        </div>
      </section>
    );
  }
);
