import Image from 'next/image';
import Link from 'next/link';

import HeaderBottom from '@/components/modules/header/HeaderBottom';
import HeaderProvider from '@/components/modules/header/HeaderProvider';

import logo from '@/public/image/assets/logo.png';
import { getStaticData } from '@/services/server-action/header';
import { fetchInitialUserData } from '@/services/server-action/profile';

const Header = async () => {
  const { categoriesInfo, cartQuantity } = await getStaticData();
  const { isAuth, myFavorites } = await fetchInitialUserData();

  return (
    <HeaderProvider value={{ isAuth, myFavorites, categoriesInfo, cartQuantity }}>
      <header className="header">
        <div className="container header__container">
          <div className="header__top">
            <div className="header__logo">
              <Link href="/" className="header__logo-link">
                <Image src={logo} alt="Online Shop логотип" width={205} height={60} />
              </Link>
            </div>
          </div>
          <HeaderBottom />
        </div>
      </header>
    </HeaderProvider>
  );
};

export default Header;
