import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import CategoriesSchema from '@/models/categoriesModel';
import { ICategories } from '@/types/types';

export async function GET() {
  await connectMongoDB();
  try {
    const categories: ICategories[] = await CategoriesSchema.find();

    if (!categories) {
      return NextResponse.json({ success: false, error: 'Категории не найдены' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.filter((item) => item.display),
        categoriesQuantity: categories.length,
      },
      message: 'Категории найдены',
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
