import React, { useEffect, useState } from 'react';

import style from '@/styles/priceRange.module.css';

interface IProps {
  min?: number;
  max?: number;
  callback: (min: number, max: number) => void;
}

export const PriceRange = ({ callback, min = 500, max = 100000 }: IProps) => {
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const [validationError, setValidationError] = useState(false);

  const regExp = /^[0-9]+$/;

  const rangeMinHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || regExp.test(val)) {
      setMinPrice(Number(val) || 0);
    }
  };

  const rangeMaxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || regExp.test(val)) {
      setMaxPrice(Number(val) || 0);
    }
  };

  useEffect(() => {
    setValidationError(() => (minPrice > maxPrice ? true : false));
  }, [minPrice, maxPrice]);

  return (
    <div className={style.container}>
      <div className={style.title}>Цена</div>
      <div className={style.fields}>
        <input
          className={`${style.field} ${validationError ? style.validation : ''}`}
          type="text"
          placeholder="ОТ"
          value={minPrice}
          onChange={rangeMinHandler}
        />
        <span>{'-'}</span>
        <input
          className={`${style.field} ${validationError ? style.validation : ''}`}
          type="text"
          placeholder="ДО"
          value={maxPrice}
          onChange={rangeMaxHandler}
        />
        <button
          className={style.button}
          type="button"
          disabled={validationError ? true : false}
          onClick={() => callback(minPrice, maxPrice)}
        >
          Ок
        </button>
      </div>
    </div>
  );
};
