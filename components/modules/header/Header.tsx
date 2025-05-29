import Image from 'next/image';
import Link from 'next/link';

import HeaderBottom from '@/components/modules/header/HeaderBottom';

import logo from '@/public/image/assets/logo.png';
import { getCategories } from '@/services/api/categories';
import { getCartQuantity, loginCheck } from '@/services/server-action/actions';
import { getUserFavoritesIds } from '@/services/server-action/favorites';

const Header = async () => {
  const { data } = await getCategories();
  const categories = data?.categories || [];
  const isAuth = await loginCheck();
  const isFavorites = await getUserFavoritesIds();
  const cartQuantity = await getCartQuantity();

  return (
    <header className="header">
      <div className="container header__container">
        <div className="header__top">
          <div className="header__logo">
            <Link href="/" className="header__logo-link">
              <Image src={logo} alt="Online Shop логотип" width={205} height={60} />
            </Link>
          </div>
        </div>
        <HeaderBottom
          categories={categories}
          isAuth={isAuth}
          isFavorites={isFavorites}
          cartQuantity={cartQuantity}
        />
      </div>
    </header>
  );
};

export default Header;
