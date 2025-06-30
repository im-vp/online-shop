'use client';

import { useState } from 'react';

import CabinetLogOutButton from '@/components/modules/cabinet/cabinetMenu/CabinetLogOutButton';
import CabinetMenuItem from '@/components/modules/cabinet/cabinetMenu/CabinetMenuItem';
import CabinetToggleButton from '@/components/modules/cabinet/cabinetMenu/CabinetToggleButton';

import { CABINET_MENU_LIST } from '@/constants/constants';

const CabinetMenu = () => {
  const [isMenuShow, setIsMenuShow] = useState(false);

  return (
    <nav className="cabinet-page__menu">
      <CabinetToggleButton setIsMenuShow={setIsMenuShow} isMenuShow={isMenuShow} />
      <ul
        className={`${'cabinet-page__menu-list'} ${isMenuShow ? 'cabinet-page__menu-list--active' : ''}`}
      >
        {CABINET_MENU_LIST.map((item) => (
          <CabinetMenuItem key={item.path} name={item.name} path={item.path} />
        ))}
        <li className="cabinet-page__menu-item">
          <CabinetLogOutButton />
        </li>
      </ul>
    </nav>
  );
};

export default CabinetMenu;
