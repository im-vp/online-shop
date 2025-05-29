import HomeSlider from '@/components/modules/homeSlider/HomeSlider';
import { ProductSliders } from '@/components/modules/sliders/ProductSliders';

import { IProduct } from '@/types/types';

export const Home = ({
  popularProducts,
  newProducts,
}: {
  popularProducts: IProduct[];
  newProducts: IProduct[];
}) => {
  return (
    <div className="home-page">
      <HomeSlider />
      <ProductSliders title="Новинки" products={newProducts} />
      <ProductSliders title="Популярные товары" products={popularProducts} />
    </div>
  );
};
