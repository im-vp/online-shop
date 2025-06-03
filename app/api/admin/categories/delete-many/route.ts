import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import { getCorsHeaders } from '@/constants/corsHeaders';
import CategoriesSchema from '@/models/categoriesModel';

export async function DELETE(request: Request, response: Response) {
  const origin = request.headers.get('origin');
  const corsHeaders = { headers: getCorsHeaders(origin) };

  try {
    const { id } = await request.json();

    await connectMongoDB();

    const deletedCategory = await CategoriesSchema.deleteMany({
      _id: { $in: id },
    });

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: 'Категория не найдена' },
        { status: 404, ...corsHeaders },
      );
    }

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
