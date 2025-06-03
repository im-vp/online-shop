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
    const rangeParam = url.searchParams.get('range') || JSON.stringify([0, 9]);
    const sortParam = url.searchParams.get('sort') || JSON.stringify(['name', 'ASC']);
    const range = JSON.parse(rangeParam);
    const sort = JSON.parse(sortParam);

    const categories: IProduct[] = await ProductSchema.find()
      .sort({
        [sort[0]]: sort[1] === 'ASC' ? 1 : -1,
      })
      .populate('category')
      .lean();

    if (!categories) {
      return NextResponse.json({ items: [], count: 0 }, corsHeaders);
    }

    return NextResponse.json(
      {
        items: categories.slice(range[0], range[1]).map((item) => ({ ...item, id: item._id })),
        count: categories.length,
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
