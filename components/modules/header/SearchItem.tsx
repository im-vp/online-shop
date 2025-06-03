import Image from 'next/image';
import Link from 'next/link';

import Price from '@/components/elements/Price';

import style from '@/styles/searchItem.module.css';
import { IProduct } from '@/types/types';

export const SearchItem = ({ product }: { product: IProduct }) => {
  return (
    <li className={style.item}>
      <Link className={style.link} href={product.path}>
        <div className={style.image}>
          <Image src={product.images[0]} alt={product.name} width={50} height={50} />
        </div>
        <div className={style.name}>{product.name}</div>
        <Price className={style.price} price={product.price} />
      </Link>
    </li>
  );
};
