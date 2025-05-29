import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import { corsHeaders } from '@/constants/corsHeaders';
import ProductSchema from '@/models/productModel';

export async function DELETE(request: Request, response: Response) {
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
    if (error.errorResponse) {
      return NextResponse.json(
        { success: false, message: error.errorResponse.errmsg },
        { ...corsHeaders },
      );
    }

    return NextResponse.json({ success: false, message: error }, corsHeaders);
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { ...corsHeaders });
}
