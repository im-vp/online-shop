'use client';

import { FC } from 'react';

import OrdersItem from '@/components/modules/cabinet/orders/OrdersItem';
import Spinner from '@/components/ui/spinner/Spinner';

import { OrdersApi } from '@/services/api/orders';
import '@/styles/cabinet-page/orders.css';
import { useQuery } from '@tanstack/react-query';

interface Props {
  userId: string;
}

const Orders: FC<Props> = ({ userId }) => {
  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['orders'],
    queryFn: () => OrdersApi.getById(userId),
  });

  return (
    <>
      {isSuccess && <h2 className="cabinet-page__title">{data?.message}</h2>}
      {isPending ? (
        <Spinner
          color="#1db954"
          css={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '25px auto' }}
        />
      ) : (
        isSuccess &&
        data.data && (
          <ul className="order-list">
            {data.data.map((item) => (
              <OrdersItem key={item._id} orderProduct={item} />
            ))}
          </ul>
        )
      )}
    </>
  );
};

export default Orders;
