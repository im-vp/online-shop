import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import OrderModel from '@/models/orderModel';
import ProductModel from '@/models/productModel';
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
      .populate({
        path: 'products.product',
        model: ProductModel,
      });

    if (!orders || !orders.length) {
      return NextResponse.json({ success: false, message: 'Список заказов пуст' }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: orders, message: 'Ваши заказы' });
  } catch (error: any) {
    const result = serverErrorHandler(error);
    return NextResponse.json(result, { status: result.status });
  }
}
