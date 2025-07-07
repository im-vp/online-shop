import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import OrderModel from '@/models/orderModel';

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const body = await req.json();

    const { products, userId, guestName, guestEmail, phoneNumber, deliveryAddress, totalPrice } =
      body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'Нет продуктов' }, { status: 400 });
    }

    if (!phoneNumber || !deliveryAddress || !totalPrice) {
      return NextResponse.json({ error: 'Не все обязательные поля заполнены' }, { status: 400 });
    }

    if (!userId) {
      if (!guestName || !guestEmail) {
        return NextResponse.json({ error: 'Гостю нужно указать имя и email' }, { status: 400 });
      }
    }

    const orderDoc = await OrderModel.create({
      userId: userId ? userId : null,
      guestName: !userId ? guestName : null,
      guestEmail: !userId ? guestEmail : null,
      phoneNumber,
      deliveryAddress,
      totalPrice,
      products,
      orderNumber: Date.now().toString(),
      status: 'pending',
    });

    const response = NextResponse.json({ success: true, data: orderDoc }, { status: 201 });
    response.cookies.set('cart', JSON.stringify([]));

    return response;
  } catch (error: any) {
    return NextResponse.json(serverErrorHandler(error));
  }
}
