import { NextResponse } from 'next/server';

import { writeFile } from 'fs/promises';
import path from 'path';

import { connectMongoDB } from '@/lib/mongodb';
import { generateProductCode } from '@/lib/utils/utils';

import { corsHeaders } from '@/constants/corsHeaders';
import CategoriesModel from '@/models/categoriesModel';
import ProductSchema from '@/models/productModel';
import { ICategories } from '@/types/types';

export async function POST(request: Request, response: Response) {
  try {
    const formData = await request.formData();

    const categoryId = formData.get('categoryId');
    const name = formData.get('name');
    const slug = formData.get('slug');
    const price = formData.get('price');
    const description = formData.get('description');

    await connectMongoDB();

    const category: ICategories | null = await CategoriesModel.findOne({ _id: categoryId });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Категория не найдена' },
        { ...corsHeaders, status: 404 },
      );
    }

    const productSlug = await ProductSchema.findOne({ slug: slug });

    if (productSlug) {
      return NextResponse.json(
        {
          success: false,
          message: `Товар с таким slug(${slug}), уже существует. id - ${productSlug._id}`,
        },
        { ...corsHeaders },
      );
    }

    // Обработка файлов
    const imagePaths = [];
    const files = formData.getAll('files'); // Получаем все файлы

    for (const file of files) {
      if (file instanceof File) {
        const extension = file.name.split('.').pop();
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}.${extension}`;
        const filePath = path.join(process.cwd(), 'public/image/products/' + filename);

        await writeFile(filePath, buffer);
        imagePaths.push(`/image/products/${filename}`);
      }
    }

    // Путь к продукту
    const productPath = `/${category.slug}/${slug}`;

    const data = {
      name,
      slug,
      price,
      description,
      images: imagePaths,
      product_code: generateProductCode(category.slug),
      category: category._id,
      path: productPath,
      rating: {
        value: 0,
        reviewCount: 0,
      },
    };
    await ProductSchema.create(data);

    return NextResponse.json(
      {
        data: {
          id: category._id,
          ...data,
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
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, message: error.message }, { ...corsHeaders });
    }

    return NextResponse.json({ success: false, message: error.message }, corsHeaders);
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { ...corsHeaders });
}
