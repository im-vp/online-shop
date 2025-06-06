import { FC } from 'react';

import HomeSlider from '@/components/modules/homeSlider/HomeSlider';
import { ProductSliders } from '@/components/modules/sliders/ProductSliders';

import { IProduct } from '@/types/types';

interface Props {
  popularProducts: IProduct[] | null;
  newProducts: IProduct[] | null;
}

export const Home: FC<Props> = ({ popularProducts, newProducts }) => {
  return (
    <div className="home-page">
      <HomeSlider />
      {newProducts && <ProductSliders title="Новинки" products={newProducts} />}
      {popularProducts && <ProductSliders title="Популярные товары" products={popularProducts} />}
    </div>
  );
};
