import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import CategoriesSchema from '@/models/categoriesModel';
import { ICategories } from '@/types/types';

export async function GET() {
  await connectMongoDB();
  try {
    const categories: ICategories[] = await CategoriesSchema.find({
      display: true,
    });

    if (!categories) {
      return NextResponse.json({ success: false, error: 'Категории не найдены' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          categories: categories,
          categoriesQuantity: categories.length,
        },
        message: 'Категории найдены',
      },
      { status: 200 },
    );
  } catch (error) {
    const result = serverErrorHandler(error);
    return NextResponse.json(result, { status: result.status });
  }
}
