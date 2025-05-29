import { FC } from 'react';

import FavoritesItem from '@/components/modules/cabinet/favorites/FavoritesItem';

import '@/styles/cabinet-page/favorites.css';
import { IProduct } from '@/types/types';

interface Props {
  favoritesProducts: IProduct[];
}

const Favorites: FC<Props> = ({ favoritesProducts }) => {
  return (
    <>
      {favoritesProducts.length ? (
        <>
          <h2 className="cabinet-page__title">Ваш список избранных товаров</h2>
          <ul className="favorites-list">
            {favoritesProducts.map((el) => (
              <FavoritesItem product={el} key={el._id} />
            ))}
          </ul>
        </>
      ) : (
        <h2 className="cabinet-page__title">У Вас пока нет избранных товаров</h2>
      )}
    </>
  );
};

export default Favorites;
