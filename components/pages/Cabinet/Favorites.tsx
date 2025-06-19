'use client';

import { FC } from 'react';

import FavoritesItem from '@/components/modules/cabinet/favorites/FavoritesItem';
import Spinner from '@/components/ui/spinner/Spinner';

import { FavoritesApi } from '@/services/api/favorites';
import '@/styles/cabinet-page/favorites.css';
import { useQuery } from '@tanstack/react-query';

interface Props {}

const Favorites: FC<Props> = () => {
  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['userFavorites'],
    queryFn: () => FavoritesApi.getAll(),
  });

  const favorites = data?.data || [];

  return (
    <>
      {isPending && (
        <Spinner
          color="#1db954"
          css={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '25px auto' }}
        />
      )}
      {isSuccess && (
        <h2 className="cabinet-page__title">
          {isSuccess && !!favorites.length
            ? 'Ваш список избранных товаров'
            : 'У Вас пока нет избранных товаров'}{' '}
        </h2>
      )}
      {!!favorites.length && (
        <ul className="favorites-list">
          {favorites.map((el) => (
            <FavoritesItem product={el} key={el._id} />
          ))}
        </ul>
      )}
    </>
  );
};

export default Favorites;
