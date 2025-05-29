import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import { corsHeaders } from '@/constants/corsHeaders';
import CategoriesSchema from '@/models/categoriesModel';

export async function DELETE(request: Request, response: Response) {
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
