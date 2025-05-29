'use client';

import { FC } from 'react';

import style from '@/styles/cartButton.module.css';

interface Props {
  text?: string;
  title?: string;
  className?: string;
  onClick?: () => void;
}

const CartButton: FC<Props> = ({ className, onClick, text, title = '' }) => {
  const handleClick = () => {
    onClick && onClick();
  };
  return (
    <button
      type="button"
      className={`${style.btn} ${className}`}
      onClick={handleClick}
      title={title}
    >
      {text && text}
    </button>
  );
};

export default CartButton;
