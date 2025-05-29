import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import ProductModel from '@/models/productModel';
import { IProduct } from '@/types/types';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search');

  await connectMongoDB();
  try {
    const products: IProduct[] | null = await ProductModel.find({
      name: { $regex: search, $options: 'i' },
    });

    if (!products) {
      return NextResponse.json({ success: false, message: 'Товары не найден' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: products, message: 'Товары получены' });
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
