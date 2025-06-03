import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import { getCorsHeaders } from '@/constants/corsHeaders';
import CategoriesSchema from '@/models/categoriesModel';
import { ICategories } from '@/types/types';

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = { headers: getCorsHeaders(origin) };

  try {
    await connectMongoDB();
    const url = new URL(request.url);

    const category: ICategories | null = await CategoriesSchema.findOne({
      _id: url.searchParams.get('id'),
    }).lean();

    if (!category) {
      return NextResponse.json({ category: [{ text: 'Category not found' }] }, corsHeaders);
    }
    const { _id, ...rest } = category;
    const newCategory = {
      id: _id,
      ...rest,
    };

    return NextResponse.json(
      {
        data: newCategory,
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
