import { FC } from 'react';

import { formatPrice } from '@/lib/utils/utils';

import style from '@/styles/price.module.css';

interface Props {
  price: number;
  isShowValuta?: boolean;
  className?: string;
}

const Price: FC<Props> = ({ price, isShowValuta = true, className = '' }) => {
  return (
    <span className={`${style.price} ${className}`}>
      {formatPrice(price)}
      {isShowValuta && <span className={style.price__currency}>₴</span>}
    </span>
  );
};

export default Price;
