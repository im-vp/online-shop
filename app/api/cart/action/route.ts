import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { getCartTotalPrice, getCartTotalQuantity, setExpireDay } from '@/lib/utils/utils';

import ProductModel from '@/models/productModel';
import { CartCookieValues, CartRequestBody, ICartProduct } from '@/types/types';

export async function POST(request: NextRequest) {
  const { action, productId, value }: CartRequestBody = await request.json();
  const cart = JSON.parse(request.cookies.get('cart')?.value || '[]');

  let newCookieObj: CartCookieValues[] = [...cart];

  const actionsCartCookie = {
    add: (id: string) => {
      const existing = newCookieObj.find((item) => item.id === id);

      if (existing) {
        newCookieObj = newCookieObj.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      } else {
        newCookieObj.push({ id, quantity: 1 });
      }
    },
    open: () => newCookieObj,
    remove: (id: string) => {
      newCookieObj = newCookieObj.filter((item) => item.id !== id);
    },
    quantity: (id: string, value: number) => {
      newCookieObj = newCookieObj.map((item) =>
        item.id === id ? { ...item, quantity: value } : item,
      );
    },
  };

  actionsCartCookie[action](productId, value || 1);

  const response = new NextResponse();
  response.cookies.set('cart', JSON.stringify(newCookieObj), {
    path: '/',
    maxAge: setExpireDay(7),
  });

  if (action === 'add' || (action === 'open' && cart.length)) {
    await connectMongoDB();

    const products = await ProductModel.find({
      _id: { $in: newCookieObj.map((item: CartCookieValues) => item.id) },
    }).lean();

    const productsCart: ICartProduct[] = products.map((product) => ({
      ...product,
      quantity: newCookieObj.find((item) => item.id === product._id.toString())?.quantity || 1,
      totalPrice:
        product.price * (newCookieObj.find((item) => item.id === product._id.toString())?.quantity || 1),
    }));
   
    return NextResponse.json(
      {
        success: true,
        products: productsCart,
        totalQuantity: getCartTotalQuantity(productsCart),
        totalSum: getCartTotalPrice(productsCart),
      },
      { status: 200, headers: response.headers },
    );
  } else {
    return NextResponse.json({ success: true }, { status: 200, headers: response.headers });
  }
}
