'use client';

import { FC, useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import HeaderCartButton from '@/components/modules/header/HeaderCartButton';
import ProfileBlock from '@/components/modules/header/ProfileBlock';
import { Search } from '@/components/modules/header/Search';

import { isCurrentUrlMatch } from '@/lib/utils/utils';

import { ICategories } from '@/types/types';

interface Props {
  categories: ICategories[];
}

const HeaderBottom: FC<Props> = ({ categories }) => {
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
          className={`header__categories-button ${activeButton && 'active'}`}
          onClick={() => {
            setActiveButton((prev) => !prev);
            activeButton ? setShowOverlay(false) : setShowOverlay(true);
          }}
        >
          Категории
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

      {activeButton && (
        <div className="header__categories-popup smoothly-down box-shadow-white">
          {categories.map((el) => (
            <div key={el._id} className="header__categories-popup-item">
              <Link href={`/${el.slug}`}>{el.name}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderBottom;
