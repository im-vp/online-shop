'use client';

import { FC } from 'react';

import CartButton from '@/components/elements/CartButton';
import Price from '@/components/elements/Price';
import { Rating } from '@/components/elements/Rating';
import ProductSlider from '@/components/modules/productSlider/ProductSlider';
import { Reviews } from '@/components/modules/reviews/Reviews';
import Spinner from '@/components/ui/spinner/Spinner';

import { SPINNER_STYLE } from '@/constants/constants';
import { useAddToCart } from '@/hooks/useAddToCart';
import '@/styles/product-page/product-page.css';
import { IProduct } from '@/types/types';

interface Props {
  product: IProduct;
}

const Product: FC<Props> = ({ product }) => {
  const { addToCartHandler, isLoading } = useAddToCart(product._id);

  return (
    <div className="product-page">
      <div className="product-page__top">
        <div className="product-page__left">
          <div className="product-page__preview">
            <ProductSlider images={product.images} />
          </div>
        </div>
        <section className="product-page__info product-page__right">
          <h1 className="product-page__title">{product.name}</h1>
          <div className="product-page__rating">
            <div className="rating">
              <Rating
                value={product.rating.value}
                reviewCount={product.rating.reviewCount}
                readonly={true}
              />
            </div>
            <span className="product-page__code">
              <span>Код:</span> {product.product_code}
            </span>
          </div>
          <div className="product-page__description">{product.description}</div>
          <div className="product-page__buy-block">
            <Price price={product.price} className="product-page__price" />
            {isLoading ? (
              <Spinner color="#FFFFFF" css={SPINNER_STYLE.buttonAddCartWithText} />
            ) : (
              <CartButton
                text="В корзину"
                onClick={() => {
                  addToCartHandler(product._id);
                }}
              />
            )}
          </div>
        </section>
      </div>
      <div className="product-page__bottom">
        <Reviews product={product} />
      </div>
    </div>
  );
};

export default Product;
