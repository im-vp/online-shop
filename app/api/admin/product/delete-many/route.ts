import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import { getCorsHeaders } from '@/constants/corsHeaders';
import ProductSchema from '@/models/productModel';

export async function DELETE(request: Request, response: Response) {
  const origin = request.headers.get('origin');
  const corsHeaders = { headers: getCorsHeaders(origin) };
  try {
    const { id } = await request.json();

    await connectMongoDB();

    // Удаляем товары и связанные рейтинги
    const deletedProducts = await ProductSchema.find({ _id: { $in: id } });

    if (!deletedProducts) {
      return NextResponse.json(
        { success: false, error: 'Товары не найдены' },
        { status: 404, ...corsHeaders },
      );
    }

    // Извлекаем все идентификаторы рейтингов, связанных с этими продуктами
    const ratingIds = deletedProducts.map((product) => product.rating);

    // Удаляем продукты
    await ProductSchema.deleteMany({ _id: { $in: id } });

    return NextResponse.json(
      {
        data: id,
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
