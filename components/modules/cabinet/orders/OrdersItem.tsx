import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Price from '@/components/elements/Price';

import { getFormattedDate } from '@/lib/utils/utils';

import { ORDER_STATUS } from '@/constants/constants';
import { IOrder } from '@/types/types';

interface Props {
  orderProduct: IOrder;
}

const OrdersItem: FC<Props> = ({ orderProduct }) => {
  const { status, orderNumber, totalPrice } = orderProduct;
  return (
    <li className="order-item">
      <div className="order-item__top">
        <div className={`order-item__status order-item__status--${status}`}>
          <span className="order-item__status-text">Статус заказа:</span>
          <span className="order-item__status-value">{ORDER_STATUS[status]}</span>
        </div>
        <div className="order-item__order-number">
          <span className="order-item__order-number-text">Номер заказа:</span>
          <span className="order-item__order-number-value">{orderNumber}</span>
        </div>
      </div>
      <div className="order-item__products-container">
        <div className="order-item__products-title">Товары:</div>
        <ul className="order-item__products-list">
          {orderProduct.products.map((item) => (
            <li className="order-item__product" key={item.product._id}>
              <Link href={item.product.path} className="order-item__product-link">
                <div className="order-item__product-image">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    width={50}
                    height={50}
                  />
                </div>
                <div className="order-item__product-name">{item.product.name}</div>
                <div className="order-item__product-quantity">{item.quantity} x</div>
                <div className="order-item__product-price">
                  <Price price={item.product.price} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="order-item__bottom">
        <div className="order-item__total-container-date">
          {`Дата заказа: ${getFormattedDate({
            date: new Date(orderProduct.createdAt),
          })}`}
        </div>
        <div className="order-item__total-container-price">
          <span>Итого:</span>
          <Price price={totalPrice} className="order-item__total-price" />
        </div>
      </div>
    </li>
  );
};

export default OrdersItem;
