import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import { getCorsHeaders } from '@/constants/corsHeaders';
import ProductSchema from '@/models/productModel';
import { IProduct } from '@/types/types';

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = { headers: getCorsHeaders(origin) };
  try {
    await connectMongoDB();
    const url = new URL(request.url);

    const product: IProduct | null = await ProductSchema.findOne({
      _id: url.searchParams.get('id'),
    })
      .populate('category')
      .lean();

    if (!product) {
      return NextResponse.json({ product: [{ text: 'Товар не найден' }] }, corsHeaders);
    }
    const { _id, ...rest } = product;
    const newProduct = {
      id: _id,
      ...rest,
      images: {
        id: product._id,
        list: product.images.map((image, i) => ({
          url: `${process.env.NEXT_PUBLIC_HOST}${image}`,
          desc: `image-${i + 1}`,
        })),
      },
    };

    return NextResponse.json(
      {
        data: newProduct,
      },
      corsHeaders,
    );
  } catch (error: any) {
    const result = serverErrorHandler(error);

    return NextResponse.json(
      { success: result.success, message: result.message, error: result.error },
      { status: result.status, headers: corsHeaders.headers },
    );
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  const corsHeaders = { headers: getCorsHeaders(origin) };
  return NextResponse.json({}, corsHeaders);
}
