'use client';

import { FC } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  name: string;
  path: string;
}

const CabinetMenuItem: FC<Props> = ({ name, path }) => {
  const currentPath = usePathname();
  return (
    <li key={path} className="cabinet-page__menu-item">
      <Link
        href={path}
        className={`cabinet-page__menu-link ${path === currentPath ? 'cabinet-page__menu-link--active' : ''}`}
        title={name}
      >
        {name}
      </Link>
    </li>
  );
};

export default CabinetMenuItem;
