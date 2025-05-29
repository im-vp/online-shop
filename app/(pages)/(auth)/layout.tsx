import Image from 'next/image';
import Link from 'next/link';

import logo from '@/public/image/assets/logo.png';
import '@/styles/authentication-page/authentication-page.css';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="wrapper authentication-page">
      <header className="authentication-page__header">
        <div className="container">
          <Link href="/" title="На главную" className="header__logo-link">
            <Image src={logo} alt="Online Shop логотип" width={205} height={60} />
          </Link>
        </div>
      </header>
      <div className="container authentication-container">{children}</div>
    </main>
  );
}
