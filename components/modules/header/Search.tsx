'use client';

import { FC, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { SearchItem } from '@/components/modules/header/SearchItem';
import Spinner from '@/components/ui/spinner/Spinner';

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
  const { data, isSuccess, isPending } = useSearchProductQuery(searchText);

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
            {isPending && <Spinner color="#1db954" css={{ display: 'block', margin: '0 auto' }} />}
            {isSuccess && Boolean(productsList.length) && (
              <ul className="header__search-dropdown-list">
                {productsList.map((product) => (
                  <SearchItem product={product} key={product._id} />
                ))}
              </ul>
            )}
            {isSuccess && !Boolean(productsList.length) && (
              <p className="header__search-dropdown-list-empty">Ничего не найдено</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
