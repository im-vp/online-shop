import type { Metadata } from 'next';
import { Montserrat_Alternates } from 'next/font/google';

import '@/app/global-style/globals.css';
import '@/app/global-style/header.css';

import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import RootInitProvider from '@/components/modules/providers/RootInitProvider';

import { siteMetadata } from '@/seoConfig';
import { getStaticData } from '@/services/server-action/header';
import { fetchInitialUserData } from '@/services/server-action/profile';

const montserratAlternates = Montserrat_Alternates({
  subsets: ['cyrillic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-montserrat-alternates',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteMetadata.main.title}`,
    default: siteMetadata.main.title,
  },
  description: siteMetadata.main.description,
  keywords: siteMetadata.main.keywords,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { categoriesInfo, cartQuantity } = await getStaticData();
  const { isAuth, favorites, profile } = await fetchInitialUserData();
  
  return (
    <ReactQueryProvider>
      <RootInitProvider value={{ isAuth, myFavorites: favorites, userProfile: profile, cartQuantity, categoriesInfo }}>
        <html lang="ru">
          <body className={montserratAlternates.variable}>{children}</body>
        </html>
      </RootInitProvider>
    </ReactQueryProvider>
  );
}
