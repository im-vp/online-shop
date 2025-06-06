import { redirect } from 'next/navigation';

import Checkout from '@/components/pages/Checkout/Checkout';

import { getCartProducts, getUserProfile } from '@/services/server-action/actions';

export const metadata = {
  title: 'Оформление заказа',
};

const CheckoutPage = async () => {
  const cart = await getCartProducts();

  if (!cart) return redirect('/');

  const { data } = await getUserProfile();

  return <Checkout profile={data ?? null} cartData={cart} />;
};

export default CheckoutPage;
