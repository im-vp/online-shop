'use client';

import { FC, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { SearchItem } from '@/components/modules/header/SearchItem';

import { useSearchProductQuery } from '@/hooks/useSearchProductQuery';
import { IProduct } from '@/types/types';

interface Props {
  onFocus?: (boolean: boolean) => void;
}

export const Search: FC<Props> = ({ onFocus }) => {
  const pathname = usePathname();
  const [productsList, setProductsList] = useState<IProduct[]>([]);
  const [searchText, setSearchText] = useState('');
  const [dropdownShow, setDropdownShow] = useState(false);
  const { data, isSuccess, isFetching } = useSearchProductQuery(searchText);

  useEffect(() => {
    if (searchText) {
      setDropdownShow(true);
      onFocus && onFocus(true);
    } else {
      setDropdownShow(false);
    }
  }, [searchText]);

  useEffect(() => {
    if (isSuccess && data?.data && data.success) {
      setProductsList(data.data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    setSearchText('');
    setDropdownShow(false);
    onFocus && onFocus(false);
  }, [pathname]);
  return (
    <div className="header__search">
      <div className="header__search-container">
        <input
          type="text"
          className="header__search-input"
          placeholder="Поиск..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => {
            searchText && setDropdownShow(true);
            onFocus && onFocus(true);
          }}
          onBlur={() => {
            setDropdownShow(false);
            onFocus && onFocus(false);
          }}
        />
        {searchText && (
          <button
            type="button"
            className="header__search-clean-button"
            onClick={() => setSearchText('')}
          ></button>
        )}
        {dropdownShow && (
          <div
            className="header__search-dropdown box-shadow-white smoothly-down"
            onMouseDown={(e) => e.preventDefault()}
          >
            {productsList.length ? (
              <ul className="header__search-dropdown-list">
                {productsList.map((product) => (
                  <SearchItem product={product} key={product._id} />
                ))}
              </ul>
            ) : (
              <p className="header__search-dropdown-list-empty">Ничего не найдено</p>
            )}
          </div>
        )}
      </div>
      {/* <button type="button" className="header__search-button">
        Найти
      </button> */}
    </div>
  );
};
