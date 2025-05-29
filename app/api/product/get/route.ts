import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import ProductModel from '@/models/productModel';
import { IProduct } from '@/types/types';

export async function GET(request: NextRequest) {
  const productSlug = request.nextUrl.searchParams.get('product');

  await connectMongoDB();
  try {
    const product: IProduct | null = await ProductModel.findOne({
      slug: productSlug,
    }).populate('category');

    if (!product) {
      return NextResponse.json({ success: false, message: 'Товар не найден' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product, message: 'Товар получен' });
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
