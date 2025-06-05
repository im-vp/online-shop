import Image from 'next/image';
import Link from 'next/link';

import HeaderBottom from '@/components/modules/header/HeaderBottom';
import HeaderProvider from '@/components/modules/header/HeaderProvider';

import logo from '@/public/image/assets/logo.png';
import { getCategories } from '@/services/api/categories';
import { getCartQuantity, loginCheck } from '@/services/server-action/actions';
import { getUserFavoritesIds } from '@/services/server-action/favorites';

const Header = async () => {
  const { data } = await getCategories();
  const categories = data?.categories || [];
  const isAuth = await loginCheck();
  const myFavorites = await getUserFavoritesIds();
  const cartQuantity = await getCartQuantity();

  return (
    <HeaderProvider value={{ isAuth, myFavorites, cartQuantity }}>
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
          />
        </div>
      </header>
    </HeaderProvider>
  );
};

export default Header;
