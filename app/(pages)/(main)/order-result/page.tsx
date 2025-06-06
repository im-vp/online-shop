import { FC } from 'react';

import dynamic from 'next/dynamic';

const ClientOrderResult = dynamic(() => import('@/components/pages/OrderResult/OrderResult'), {
  ssr: false,
  loading: () => <h1 className="page__title">Загрузка...</h1>,
});

interface Props {}

const OrderResultPage: FC<Props> = ({}) => {
  return <ClientOrderResult />;
};

export default OrderResultPage;
