import { Home } from '@/components/pages/Home/Home';

import { getHomeProducts } from '@/services/server-action/products';
import '@/styles/home/home-page.css';

export default async function HomePage() {
  const { data } = await getHomeProducts();

  return (
    <Home popularProducts={data?.popularProducts ?? null} newProducts={data?.newProducts ?? null} />
  );
}
