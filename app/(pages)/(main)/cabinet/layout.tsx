import CabinetLayout from '@/components/layout/CabinetLayout';

import '@/styles/cabinet-page/cabinet-page.css';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CabinetLayout>{children}</CabinetLayout>;
}
