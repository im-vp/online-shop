import { FC } from 'react';

import Spinner from '@/components/ui/spinner/Spinner';

import { useCartStore } from '@/hooks/store/useStore';
import { useAddToCart } from '@/hooks/useAddToCart';

interface Props {}

const HeaderCartButton: FC<Props> = ({}) => {
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const { isLoading, openCartHandler } = useAddToCart();

  if (isLoading)
    return (
      <Spinner
        css={{
          width: '40px',
          height: '40px',
          border: '2px solid #fff',
          borderRadius: '50%',
        }}
      />
    );

  return (
    <button
      type="button"
      title="Корзина"
      className="header__button icon-container header__button--cart"
      onClick={openCartHandler}
    >
      {totalQuantity > 0 && <span className="header__button--cart-count">{totalQuantity}</span>}
    </button>
  );
};

export default HeaderCartButton;
