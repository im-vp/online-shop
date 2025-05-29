import Link from 'next/link';

import Price from '@/components/elements/Price';

import style from '@/styles/searchItem.module.css';
import { IProduct } from '@/types/types';

export const SearchItem = ({ product }: { product: IProduct }) => {
  return (
    <li className={style.item}>
      <Link className={style.link} href={product.path}>
        <div className={style.name}>{product.name}</div>
        <Price price={product.price} />
      </Link>
    </li>
  );
};
