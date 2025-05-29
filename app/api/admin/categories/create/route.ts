import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import { corsHeaders } from '@/constants/corsHeaders';
import CategoriesSchema from '@/models/categoriesModel';

export async function POST(request: Request, response: Response) {
  try {
    const formData = await request.formData();
    const category = formData.get('category');
    const slug = formData.get('slug');

    await connectMongoDB();

    const createdCategory = await CategoriesSchema.create({
      name: category,
      slug: slug,
    });

    return NextResponse.json(
      {
        data: {
          id: createdCategory._id,
          name: createdCategory.name,
          slug: createdCategory.slug,
        },
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

    return NextResponse.json({ success: false, message: error.message }, corsHeaders);
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { ...corsHeaders });
}
