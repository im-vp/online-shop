import { FC, useContext, useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useFavoritesStore } from '@/store/FavoritesStore';
import { useUserStore } from '@/store/UserStore';
import { UserContext } from '@/components/modules/header/HeaderProvider';

interface Props {}

const ProfileBlock: FC<Props> = () => {
  const { isAuth, myFavorites } = useContext(UserContext);
  const path = usePathname();
  const [isUserFavorites, setIsUerFavorites] = useState(myFavorites);
  const { addAllFavorites, favorites } = useFavoritesStore((state) => state);
  const setAuthStatus = useUserStore().setAuthStatus;

  useEffect(() => {
    setAuthStatus(isAuth);
  }, [isAuth]);

  useEffect(() => {
    isUserFavorites && addAllFavorites(isUserFavorites);
  }, [myFavorites]);

  useEffect(() => {
    setIsUerFavorites(favorites);
  }, [favorites]);

  return (
    <>
      {isAuth ? (
        <>
          <Link
            href="/cabinet/favorites"
            key={`${path}-favorites`}
            title={`${isUserFavorites && isUserFavorites.length ? 'У Вас есть товары в избранном' : 'Избранное'}`}
            className={`header__button icon-container header__button--favorites ${isUserFavorites && isUserFavorites.length ? 'header__button--favorites--active' : ''}`}
          ></Link>
          <Link
            href="/cabinet/orders"
            key={`${path}-orders`}
            title="Личный кабинет"
            className="header__button icon-container header__button--profile header__button--profile--auth"
          ></Link>
        </>
      ) : (
        <Link
          href="/authentication"
          title="Войти в кабинет"
          className="header__button header__button--profile icon-container"
        ></Link>
      )}
    </>
  );
};

export default ProfileBlock;
