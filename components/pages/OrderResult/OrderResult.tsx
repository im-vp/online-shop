'use client';

import { FC, useEffect } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import '@/styles/order-result-page/order-result-page.css';

interface Props {}

const OrderResult: FC<Props> = ({}) => {
  const router = useRouter();
  const searchParams = useSearchParams(),
    orderId = searchParams.get('orderId'),
    isAuth = searchParams.get('isAuth');

  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
  }, [orderId]);

  return (
    <div className="order-result-page">
      <h1 className="page__title">Заказ успешно оформлен!</h1>
      <div className="order-result-page__text">
        <p className="order-result-page__order-number">
          Номер заказа: <span>{orderId}</span>
        </p>
        {isAuth === 'true' && (
          <p className="order-result-page__go-to-orders">
            Перейти к{' '}
            <Link className="underline-hover" href="/cabinet/orders">
              моим заказам
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderResult;
