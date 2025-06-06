import { redirect } from 'next/navigation';

import Orders from '@/components/pages/Cabinet/Orders';

import { getUserProfile } from '@/services/server-action/actions';

const OrdersPage = async () => {
  const { data: profile } = await getUserProfile();

  if (!profile) redirect('/authentication');

  return <Orders userId={profile._id} />;
};

export default OrdersPage;
