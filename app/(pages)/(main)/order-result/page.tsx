import { FC } from 'react';

import OrderResult from '@/components/pages/OrderResult/OrderResult';

export const dynamic = 'force-dynamic';
interface Props {}

const OrderResultPage: FC<Props> = ({}) => {
  return <OrderResult />;
};

export default OrderResultPage;
