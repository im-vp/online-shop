'use client';

import { FC } from 'react';

import { useRouter } from 'next/navigation';

import Spinner from '@/components/ui/spinner/Spinner';

import { POPUP_ID } from '@/constants/constants';
import { useUserStore } from '@/hooks/store/useStore';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import style from '@/styles/favoriteButton.module.css';

interface Props {
  productId: string;
}

const FavoritesButton: FC<Props> = ({ productId }) => {
  const { addUserFavorites, userFavorites } = useUserStore((state) => state);
  const { mutate, isPending } = useToggleFavorite();
  const pathname = useRouter();

  const isFavoritesActive = userFavorites.includes(productId);

  const handleFavorites = async (productId: string) => {
    mutate(productId, {
      onSuccess: (data) => {
        if (!data.success && !data?.data?.isAuth) {
          pathname.push(`/${POPUP_ID.authentication}`);
        } else {
          addUserFavorites(productId);
        }
      },
    });
  };

  return (
    <>
      {isPending ? (
        <Spinner
          color="#83837b"
          css={{ display: 'block', width: '20px', height: '20px', margin: '10px 0' }}
        />
      ) : (
        <button
          type="button"
          title={`${isFavoritesActive ? 'Удалить из избранного' : 'Добавить в избранное'}`}
          className={`icon-container ${style.product__favorites} ${isFavoritesActive && style.product__favorites_active}`}
          onClick={() => handleFavorites(productId)}
        ></button>
      )}
    </>
  );
};

export default FavoritesButton;
