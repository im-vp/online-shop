import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

import CategoriesModel from '@/models/categoriesModel';
import ProductModel from '@/models/productModel';
import { ICategories, IProduct } from '@/types/types';

export async function GET(request: NextRequest) {
  const categorySlug = request.nextUrl.searchParams.get('category');
  const sort = request.nextUrl.searchParams.get('sort') || 'rating';
  const range = request.nextUrl.searchParams.get('range') || null;

  const sortObject = {
    rating: {
      field: 'rating.value',
      order: -1,
    },
    cheap: {
      field: 'price',
      order: 1,
    },
    expensive: {
      field: 'price',
      order: -1,
    },
  };

  await connectMongoDB();
  try {
    const category: ICategories | null = await CategoriesModel.findOne({ slug: categorySlug });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Категория не найдена' },
        { status: 404 },
      );
    }

    // Создаем объект фильтрации с категорией и диапазоном цен
    const filter: any = { category: category._id };

    if (range && typeof range === 'string' && range !== 'null') {
      const minPrice = range?.split('-')[0] || 0;
      const maxPrice = range?.split('-')[1] || 0;

      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Проходим по всем параметрам запроса
    request.nextUrl.searchParams.forEach((value, key) => {
      // Игнорируем параметры сортировки, категории и цен
      if (key !== 'category' && key !== 'sort' && key !== 'range') {
        // Добавляем параметры как фильтры в запрос (например, фильтрация по цвету, размеру и т.д.)
        filter[key] = value;
      }
    });

    const products: IProduct[] | null = await ProductModel.find(filter) //@ts-ignore
      .sort({ [sortObject[sort].field]: sortObject[sort].order })
      .populate('category');

    if (!products) {
      return NextResponse.json({ success: false, message: 'Товар не найден' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { products, productsQuantity: products.length, category },
      message: 'Товары получены',
    });
  } catch (error: any) {
    if (error.errorResponse) {
      return NextResponse.json({ success: false, message: error.errorResponse.errmsg });
    }
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, message: error.message });
    }

    return NextResponse.json(
      { success: false, message: 'Что-то пошло не так...', error: error.message },
      { status: 500 },
    );
  }
}
