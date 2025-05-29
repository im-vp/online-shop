import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import { corsHeaders } from '@/constants/corsHeaders';
import CategoriesSchema from '@/models/categoriesModel';
import { ICategories } from '@/types/types';

export async function GET(request: NextRequest) {
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
    return NextResponse.json(
      { success: false, message: 'Что-то пошло не так...', error: error.message },
      { status: 500 },
    );
  }
}
