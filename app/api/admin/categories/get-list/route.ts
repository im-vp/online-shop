import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import { corsHeaders } from '@/constants/corsHeaders';
import CategoriesSchema from '@/models/categoriesModel';
import { ICategories } from '@/types/types';

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const url = new URL(request.url);
    const rangeParam = url.searchParams.get('range') || JSON.stringify([0, 9]);
    const sortParam = url.searchParams.get('sort') || JSON.stringify(['name', 'ASC']);
    const range = JSON.parse(rangeParam);
    const sort = JSON.parse(sortParam);

    const categories: ICategories[] = await CategoriesSchema.find()
      .sort({
        [sort[0]]: sort[1] === 'ASC' ? 1 : -1,
      })
      .lean();

    if (!categories) {
      return NextResponse.json({ items: [], count: 0 }, corsHeaders);
    }

    return NextResponse.json(
      {
        items: categories.slice(range[0], range[1]).map((item) => ({ ...item, id: item._id })),
        count: categories.length,
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
