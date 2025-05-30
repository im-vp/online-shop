import { Home } from '@/components/pages/Home/Home';

import { getNewProducts, getPopularProducts } from '@/services/server-action/products';
import '@/styles/home/home-page.css';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const popularP = await getPopularProducts();
  const newP = await getNewProducts();

  const popularProducts = popularP.success ? JSON.parse(JSON.stringify(popularP.data)) : [];
  const newProducts = newP.success ? JSON.parse(JSON.stringify(newP.data)) : [];

  return <Home popularProducts={popularProducts} newProducts={newProducts} />;
}
