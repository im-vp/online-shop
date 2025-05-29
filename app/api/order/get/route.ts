import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import OrderModel from '@/models/orderModel';
import { IOrder } from '@/types/types';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('id');

  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'Не передан id пользователя' },
      { status: 404 },
    );
  }

  await connectMongoDB();
  try {
    const orders: IOrder[] | null = await OrderModel.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .populate('products.product');

    if (!orders || !orders.length) {
      return NextResponse.json({ success: false, message: 'Список заказов пуст' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: orders, message: 'Ваши заказы' });
  } catch (error: any) {
    if (error.errorResponse) {
      return NextResponse.json({ success: false, message: error.errorResponse.errmsg });
    }
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, message: error.message });
    }
    return NextResponse.json({ error });
  }
}
