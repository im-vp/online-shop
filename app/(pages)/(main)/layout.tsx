import React from 'react';

import MainLayout from '@/components/layout/MainLayout';

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return <MainLayout modal={modal}>{children}</MainLayout>;
}
