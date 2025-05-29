import { redirect } from 'next/navigation';

import Checkout from '@/components/pages/Checkout/Checkout';

import { getCartProducts, getUserProfile } from '@/services/server-action/actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Оформление заказа',
};

const CheckoutPage = async () => {
  const cart = await getCartProducts();

  if (!cart) return redirect('/');

  const data = await getUserProfile();
  const parseUserProfile = data ? JSON.parse(JSON.stringify(data)) : null;
  return <Checkout profile={parseUserProfile} cartData={cart} />;
};

export default CheckoutPage;
