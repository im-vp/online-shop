import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Price from '@/components/elements/Price';
import Quantity from '@/components/elements/Quantity';

import { useCartStore } from '@/store/CartStore';
import '@/styles/cart/cart.css';

const Cart: FC = () => {
  const { products, totalQuantity, totalSum } = useCartStore((state) => state.cart);
  const plusOne = useCartStore((store) => store.plusOne);
  const minusOne = useCartStore((store) => store.minusOne);
  const removeProduct = useCartStore((store) => store.removeFromCart);
  const router = useRouter();

  if (!totalQuantity) return <EmptyCart />;

  return (
    <div className="cart">
      <div className="cart__title">Корзина</div>
      <ul className="cart__list">
        {products.map((product) => (
          <li key={product._id} className="cart__item">
            <div className="cart__item-img">
              <Link href={product.path} title={product.name}>
                <Image src={product.images[0]} alt={product.name} width={200} height={175} />
              </Link>
            </div>
            <div className="cart__item-info">
              <div className="cart__item-top">
                <Link href={product.path} title={product.name} className="cart__item-title-link">
                  {product.name}
                </Link>
                <button
                  type="button"
                  title="Удалить из корзины"
                  className="cart__item-close"
                  onClick={() => removeProduct(product._id)}
                ></button>
              </div>
              <div className="cart__item-actions">
                <div className="cart__item-counts">
                  <Quantity
                    quantity={product.quantity}
                    onMinus={() => minusOne(product._id)}
                    onPlus={() => plusOne(product._id)}
                  />
                </div>
                <div className="cart__item-price">
                  <Price price={product.totalPrice} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart__footer">
        <div className="cart__footer-total">
          <div className="cart__footer-title">Всего:</div>
          <div className="cart__footer-price">
            <Price price={totalSum} />
          </div>
        </div>
        <button
          type="button"
          className="cart__footer-buy"
          onClick={() => {
            router.push('/checkout');
            router.refresh();
          }}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
};

const EmptyCart = () => {
  return (
    <div className="cart-empty">
      <div className="cart-empty__text">Ваша корзина пуста!</div>
      <div className="cart-empty__img">
        <Image src="/image/assets/empty-cart.png" alt="Корзина пуста" width={200} height={200} />
      </div>
    </div>
  );
};

export default Cart;
