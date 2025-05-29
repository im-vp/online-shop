import React, { FC } from 'react';

import NextTopLoader from 'nextjs-toploader';

import { Footer } from '@/components/modules/footer/Footer';
import Header from '@/components/modules/header/Header';
import PopupWrapper from '@/components/ui/popup/PopupWrapper';

interface Props {
  children: React.ReactNode;
  modal?: React.ReactNode;
}

const MainLayout: FC<Props> = ({ children, modal }) => {
  return (
    <>
      <NextTopLoader color="#fedb22" showSpinner={false} />
      <main className="wrapper">
        <Header />
        <div className="container main-content ">{children}</div>
        <Footer />
      </main>
      <PopupWrapper />
      {modal}
      <div id="popup" />
    </>
  );
};

export default MainLayout;
