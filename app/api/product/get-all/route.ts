import { NextRequest, NextResponse } from 'next/server';

import { serverErrorHandler } from '@/lib/utils/utils';

import { getCategoryProducts } from '@/services/server-action/products';

export async function GET(request: NextRequest) {
  const categoryName = request.nextUrl.searchParams.get('category');

  if (!categoryName)
    return NextResponse.json({
      success: false,
      data: null,
      message: 'Не передана категория',
    });

  const searchParams: { [key: string]: string } = {};

  request.nextUrl.searchParams.forEach((value, key) => {
    if (key !== 'category') {
      searchParams[key] = value;
    }
  });

  try {
    const { success, data, message, status } = await getCategoryProducts(
      categoryName,
      searchParams,
    );

    return NextResponse.json(
      {
        success,
        data,
        message,
      },
      {
        status,
      },
    );
  } catch (error: any) {
    const result = serverErrorHandler(error);

    return NextResponse.json(
      { success: result.success, data: result.data, message: result.message, error: result.error },
      { status: result.status },
    );
  }
}
