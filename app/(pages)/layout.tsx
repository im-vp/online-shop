import type { Metadata } from 'next';
import { Montserrat_Alternates } from 'next/font/google';

import '@/app/global-style/globals.css';
import '@/app/global-style/header.css';

import { ReactQueryProvider } from '@/components/ReactQueryProvider';

import { siteMetadata } from '@/seoConfig';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="ru">
        <body className={montserratAlternates.variable}>{children}</body>
      </html>
    </ReactQueryProvider>
  );
}
