import { useEffect, useState } from 'react';

import { getArrayFilterParams } from '@/lib/utils/utils';

import style from '@/styles/selectedFilters.module.css';
import { IFilterParams, RemoveFiltersType } from '@/types/types';

export const SelectedFilters = ({
  params,
  callback,
}: {
  params: IFilterParams;
  callback?: (obj: { key: string; val: string; remove?: RemoveFiltersType }) => void;
}) => {
  const [selectedFilters, setSelectedFilters] = useState<{ param: string; value: string }[]>(
    getArrayFilterParams(params),
  );

  useEffect(() => {
    setSelectedFilters(getArrayFilterParams(params));
  }, [params]);

  if (selectedFilters.length === 0) return null;

  return (
    <ul className={style.list}>
      <li className={style.item}>
        <button
          type="button"
          className={`${style.button} ${style.reset}`}
          onClick={() => callback && callback({ key: '', val: '', remove: 'all' })}
        >
          Сбросить
        </button>
      </li>
      {selectedFilters.map((el) => (
        <li key={el.param}>
          <button
            type="button"
            className={style.button}
            onClick={() => callback && callback({ key: el.param, val: el.value, remove: 'one' })}
          >
            {el.value}
            <span className={`icon-container ${style.icon}`}></span>
          </button>
        </li>
      ))}
    </ul>
  );
};
