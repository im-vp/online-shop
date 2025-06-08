import Image from 'next/image';
import Link from 'next/link';

import HeaderBottom from '@/components/modules/header/HeaderBottom';

import logo from '@/public/image/assets/logo.png';

const Header = async () => {
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
        <HeaderBottom />
      </div>
    </header>
  );
};

export default Header;
