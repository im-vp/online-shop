import { useEffect, useState } from 'react';

import style from '@/styles/rating.module.css';

interface Props {
  readonly?: boolean;
  value?: number;
  reviewCount?: number;
  starQuantity?: number;
  showCount?: boolean;
  callback?: (val: number) => void;
}

export const Rating = ({
  readonly = true,
  value = 0,
  reviewCount = 0,
  starQuantity = 5,
  showCount = true,
  callback,
}: Props) => {
  const [isActive, setIsActive] = useState(value);

  const handleClick = (val: number) => {
    if (readonly) return;

    setIsActive(val);
    callback && callback(val);
  };

  return (
    <div className={`${style.rating} ${readonly ? style.readonly : ''}`}>
      <div className={style.container}>
        {Array(starQuantity)
          .fill(0)
          .map((_, i) => (
            <button
              key={i}
              type="button"
              className={`icon-container ${style.button} ${i + 1 <= isActive ? style.active : ''}`}
              onClick={() => handleClick(i + 1)}
              title={readonly ? String(value) : (i + 1).toString()}
            ></button>
          ))}
      </div>
      {showCount ? <div className={style.counts}>({reviewCount})</div> : null}
    </div>
  );
};
