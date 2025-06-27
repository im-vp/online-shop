'use client';

import { FC, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import HeaderCartButton from '@/components/modules/header/HeaderCartButton';
import HeaderCategories from '@/components/modules/header/HeaderCategories';
import ProfileBlock from '@/components/modules/header/ProfileBlock';
import { Search } from '@/components/modules/header/Search';

import { isCurrentUrlMatch } from '@/lib/utils/utils';

interface Props {}

const HeaderBottom: FC<Props> = () => {
  const path = usePathname();
  const [activeButton, setActiveButton] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showComponent, setShowComponent] = useState(isCurrentUrlMatch(path));

  useEffect(() => {
    setShowOverlay(false);
    setActiveButton(false);

    setShowComponent(isCurrentUrlMatch(path));
  }, [path]);

  if (showComponent) return null;

  return (
    <div className="header__bottom">
      <div className="header__categories">
        <button
          type="button"
          className={`header__categories-button ${activeButton ? 'active' : ''}`}
          onClick={() => {
            setActiveButton((prev) => !prev);
            activeButton ? setShowOverlay(false) : setShowOverlay(true);
          }}
        >
          <span className='header__categories-button-text'>Категории</span>
        </button>
      </div>
      <Search
        onFocus={(e) => {
          setShowOverlay(e);
          setActiveButton(false);
        }}
      />
      <div className="header__button-holder">
        <ProfileBlock />
        <HeaderCartButton />
      </div>
      {showOverlay && (
        <div
          className="header__overlay opacity-in"
          onClick={() => {
            setShowOverlay(false);
            setActiveButton(false);
          }}
        ></div>
      )}
      {activeButton && <HeaderCategories />}
    </div>
  );
};

export default HeaderBottom;
