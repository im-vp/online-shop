import { redirect } from 'next/navigation';

import Orders from '@/components/pages/Cabinet/Orders';

import { getUserProfile } from '@/services/server-action/actions';

export const dynamic = 'force-dynamic';

const OrdersPage = async () => {
  const profile = await getUserProfile();
  console.log(profile);

  if (!profile) redirect('/authentication');

  return <Orders userId={profile._id} />;
};

export default OrdersPage;
