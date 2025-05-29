'use client';

import { FC, useEffect } from 'react';

import CartButton from '@/components/elements/CartButton';
import Price from '@/components/elements/Price';
import { Rating } from '@/components/elements/Rating';
import ProductSlider from '@/components/modules/productSlider/ProductSlider';
import { Reviews } from '@/components/modules/reviews/Reviews';
import Spinner from '@/components/ui/spinner/Spinner';

import { POPUP_ID, SPINNER_STYLE } from '@/constants/constants';
import { useCartStore } from '@/store/CartStore';
import { usePopupStore } from '@/store/PopupStore';
import '@/styles/product-page/product-page.css';
import { IProduct, IReviews } from '@/types/types';
import { IUser } from '@/types/user-types';

interface Props {
  product: IProduct;
  isAuth: boolean;
  profile: IUser | null;
  reviews: IReviews[];
}

const Product: FC<Props> = ({ product, isAuth, profile, reviews }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const isLoading = useCartStore((state) => state.cart.isLoading);
  const togglePopup = usePopupStore((state) => state.togglePopup);

  useEffect(() => {
    isLoading.status === 'success' && togglePopup(POPUP_ID.cart);
  }, [isLoading]);

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
            {isLoading.status === 'loading' && isLoading.productId === product._id ? (
              <Spinner color="#FFFFFF" css={SPINNER_STYLE.buttonAddCartWithText} />
            ) : (
              <CartButton
                text="В корзину"
                onClick={() => {
                  addToCart(product._id);
                }}
              />
            )}
          </div>
        </section>
      </div>
      <div className="product-page__bottom">
        <Reviews
          productId={product._id}
          productName={product.name}
          isAuth={isAuth}
          profile={profile}
          reviews={reviews}
        />
      </div>
    </div>
  );
};

export default Product;
