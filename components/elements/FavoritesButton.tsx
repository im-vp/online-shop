'use client';

import { FC, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import Spinner from '@/components/ui/spinner/Spinner';

import { POPUP_ID } from '@/constants/constants';
import { useUserStore } from '@/hooks/store/useStore';
import { toggleFavorite } from '@/services/server-action/favorites';
import style from '@/styles/favoriteButton.module.css';

interface Props {
  favorites?: string[] | null;
  productId: string;
}

const FavoritesButton: FC<Props> = ({ productId, favorites = [] }) => {
  const pathname = useRouter();

  const [isFavorites, setIsFavorites] = useState(
    (favorites && favorites.includes(productId)) || false,
  );
  const { addUserFavorites, userFavorites } = useUserStore((state) => state);
  const [spinner, setSpinner] = useState(false);

  const handleFavorites = async (productId: string) => {
    setSpinner(true);
    const { success, data } = await toggleFavorite(productId);

    if (!success && !data?.isAuth) {
      pathname.push(`/${POPUP_ID.authentication}`);
    } else {
      setIsFavorites((prev) => !prev);
      addUserFavorites(productId);
    }
    setSpinner(false);
  };

  useEffect(() => {
    setIsFavorites(userFavorites.includes(productId) || false);
  }, [userFavorites]);

  return (
    <>
      {spinner ? (
        <Spinner
          color="#83837b"
          css={{ display: 'block', width: '20px', height: '20px', margin: '10px 0' }}
        />
      ) : (
        <button
          type="button"
          title={`${isFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}`}
          className={`icon-container ${style.product__favorites} ${isFavorites && style.product__favorites_active}`}
          onClick={() => handleFavorites(productId)}
        ></button>
      )}
    </>
  );
};

export default FavoritesButton;
