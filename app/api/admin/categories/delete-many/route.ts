import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import { corsHeaders } from '@/constants/corsHeaders';
import CategoriesSchema from '@/models/categoriesModel';

export async function DELETE(request: Request, response: Response) {
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
