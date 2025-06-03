import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import { getCorsHeaders } from '@/constants/corsHeaders';
import CategoriesSchema from '@/models/categoriesModel';

export async function POST(request: Request, response: Response) {
  const origin = request.headers.get('origin');
  const corsHeaders = { headers: getCorsHeaders(origin) };

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
