import { FC } from 'react';

import Link from 'next/link';

import { useUserStore } from '@/hooks/store/useStore';

interface Props {}

const ProfileBlock: FC<Props> = () => {
  const { isAuth, userFavorites } = useUserStore((state) => state);

  return (
    <>
      {isAuth ? (
        <>
          <Link
            href="/cabinet/favorites"
            title={`${userFavorites.length ? 'У Вас есть товары в избранном' : 'Избранное'}`}
            className={`header__button icon-container header__button--favorites ${userFavorites.length ? 'header__button--favorites--active' : ''}`}
          ></Link>
          <Link
            href="/cabinet/orders"
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
