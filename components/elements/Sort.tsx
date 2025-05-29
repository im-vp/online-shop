'use client';

import { SORT_LIST } from '@/constants/constants';
import style from '@/styles/sort.module.css';

interface IProps {
  defaultValue?: string;
  callback: (val: string) => void;
}

export const Sort = ({ callback, defaultValue = '' }: IProps) => {
  return (
    <select
      defaultValue={defaultValue}
      className={style.sort}
      name="sort"
      onChange={(e) => callback(e.target.value)}
    >
      {SORT_LIST.map((item, index) => (
        <option key={index} value={item.sortProperty}>
          {item.name}
        </option>
      ))}
    </select>
  );
};
