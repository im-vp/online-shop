'use client';

import { FC, useEffect } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';

import Price from '@/components/elements/Price';
import CheckoutUserInfo from '@/components/modules/checkout/CheckoutUserInfo';
import Spinner from '@/components/ui/spinner/Spinner';

import { phoneMaskFormat } from '@/lib/utils/utils';

import { OrdersApi } from '@/services/api/orders';
import { useCartStore } from '@/store/CartStore';
import '@/styles/checkout-page/checkout-page.css';
import { CheckoutFormValues, ICart, OrderCreateApi } from '@/types/types';
import { IUser } from '@/types/user-types';
import { useMutation } from '@tanstack/react-query';

interface Props {
  profile: IUser | null;
  cartData: ICart;
}

const Checkout: FC<Props> = ({ profile, cartData }) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      phoneNumber: phoneMaskFormat(profile?.phoneNumber || ''),
    },
  });

  const cleanCart = useCartStore((state) => state.cleanCart);

  const { mutate, data, isPending, isSuccess } = useMutation({
    mutationFn: (data: OrderCreateApi) => {
      return OrdersApi.create(data);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { firstName, lastName, email, phoneNumber } = data;

    mutate({
      userId: profile?._id || undefined,
      guestName: !profile ? firstName + ' ' + lastName : undefined,
      guestEmail: !profile ? email : undefined,
      phoneNumber,
      deliveryAddress: 'null',
      totalPrice: cartData.totalSum,
      products: cartData.products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
      })),
    });
  });

  useEffect(() => {
    if (isSuccess && data.success) {
      const path = `/order-result?orderId=${data.data?.orderNumber}${!!profile ? '&isAuth=true' : ''}`;
      cleanCart();
      router.push(path);
    }
  }, [isSuccess]);

  return (
    <section className="checkout-page">
      <h1 className="page__title">Оформление заказа</h1>
      <form className="checkout-page__container" onSubmit={onSubmit}>
        <div className="checkout-page__main">
          <div className="checkout-page__holder-info">
            <div className="checkout-page__holder-info__title">Контактные данные</div>
            <CheckoutUserInfo
              profile={profile}
              register={register}
              errors={errors}
              control={control}
            />
          </div>
        </div>
        <div className="checkout-page__second">
          <div className="checkout-page__holder-info">
            <div className="checkout-page__holder-info__title">Ваш заказ</div>
            <div className="checkout-page__holder-items">
              <ul className="checkout-page__product-list">
                {cartData.products.map((product) => (
                  <li key={product._id} className="checkout-page__product-item">
                    <div className="checkout-page__product-item-img">
                      <Image src={product.images[0]} alt={product.name} width={100} height={80} />
                    </div>
                    <div className="checkout-page__item-info">
                      <div className="checkout-page__item-title">{product.name}</div>
                      <div className="checkout-page__item-price-holder">
                        {product.quantity > 1 && (
                          <div className="checkout-page__item-quantity">
                            {product.quantity} {'x'}{' '}
                            {<Price isShowValuta={false} price={product.price} />}
                          </div>
                        )}
                        <div className="checkout-page__item-total-price">
                          <Price price={product.totalPrice} />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="checkout-page__holder-items__total">
                <div className="checkout-page__holder-items__total-title">К оплате:</div>
                <div className="checkout-page__holder-items__total-price">
                  <Price price={cartData.totalSum} />
                </div>
              </div>
              <div className="checkout-page__holder-info__button-holder">
                <button type="submit" className="checkout-page__holder-info__button-submit">
                  Оформить заказ
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      {isPending && (
        <Spinner
          color="#28d765"
          css={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            width: 'auto',
            height: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />
      )}
    </section>
  );
};

export default Checkout;
