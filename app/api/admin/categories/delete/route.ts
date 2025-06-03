import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import { getCorsHeaders } from '@/constants/corsHeaders';
import CategoriesSchema from '@/models/categoriesModel';

export async function DELETE(request: Request, response: Response) {
  const origin = request.headers.get('origin');
  const corsHeaders = { headers: getCorsHeaders(origin) };

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    await connectMongoDB();

    const deletedCategory = await CategoriesSchema.findByIdAndDelete(id).lean();

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: 'Категория не найдена' },
        { status: 404, ...corsHeaders },
      );
    }

    return NextResponse.json(
      {
        data: { id: deletedCategory._id },
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
