'use client';

import { FC, useState } from 'react';

import style from '@/styles/quantity.module.css';

interface Props {
  quantity?: number;
  className?: string;
  onPlus?: () => void;
  onMinus?: () => void;
}

const Quantity: FC<Props> = ({ quantity = 1, onPlus, onMinus, className = '' }) => {
  const [value, setValue] = useState(quantity);

  const handleClickPlus = () => {
    setValue((prev) => prev + 1);
    onPlus && onPlus();
  };

  const handleClickMinus = () => {
    if (value === 1) return;

    setValue((prev) => prev - 1);
    onMinus && onMinus();
  };
  return (
    <div className={`${style.container} ${className}`}>
      <button
        type="button"
        onClick={handleClickMinus}
        className={`${style.button} ${style.minus}`}
      ></button>
      <input type="text" readOnly className={style.input} value={value} />
      <button
        type="button"
        onClick={handleClickPlus}
        className={`${style.button} ${style.plus}`}
      ></button>
    </div>
  );
};

export default Quantity;
