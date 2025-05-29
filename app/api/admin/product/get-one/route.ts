import { NextRequest, NextResponse } from 'next/server';

import { title } from 'process';

import { connectMongoDB } from '@/lib/mongodb';

import { corsHeaders } from '@/constants/corsHeaders';
import ProductSchema from '@/models/productModel';
import { IProduct } from '@/types/types';

export async function GET(request: NextRequest) {
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
    const newProduct = {
      id: product._id,
      ...product,
      images: {
        id: product._id,
        list: product.images.map((image, i) => ({
          url: `${process.env.NEXT_PUBLIC_HOST}${image}`,
          desc: `image-${i + 1}`,
        })),
      },
    };
    delete newProduct._id;

    return NextResponse.json(
      {
        data: newProduct,
      },
      corsHeaders,
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Что-то пошло не так...', error: error.message },
      { status: 500 },
    );
  }
}
