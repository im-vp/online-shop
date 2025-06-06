'use server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import CategoriesModel from '@/models/categoriesModel';
import ProductModel from '@/models/productModel';
import { IApiResponse, IHomeProductsParams, IHomeProductsResponse, IProduct } from '@/types/types';

export const getProduct = async (slug: string | null): Promise<IApiResponse<IProduct>> => {
  if (!slug) {
    return { data: null, success: false, message: 'товар не найден' };
  }

  try {
    await connectMongoDB();
    const product: IProduct | null = await ProductModel.findOne({ slug }).populate({
      path: 'category',
      model: CategoriesModel,
    });

    if (!product) {
      return { data: null, success: false, message: 'товар не найден' };
    }

    return {
      data: JSON.parse(JSON.stringify(product)) as IProduct,
      success: true,
      message: 'Товар получен',
    };
  } catch (error: any) {
    return serverErrorHandler(error);
  }
};

export const getHomeProducts = async ({
  popularLimit,
  newLimit,
}: IHomeProductsParams = {}): Promise<IApiResponse<IHomeProductsResponse>> => {
  try {
    await connectMongoDB();
    const [popular, newest] = await Promise.all([
      getPopularProducts(popularLimit),
      getNewProducts(newLimit),
    ]);

    if (!popular.success || !newest.success) {
      return {
        data: {
          popularProducts: popular.data ?? null,
          newProducts: newest.data ?? null,
        },
        success: false,
        message: `Ошибка при получении ${
          !popular.success && !newest.success
            ? 'популярных и новых товаров'
            : !popular.success
              ? 'популярных товаров'
              : 'новых товаров'
        }`,
      };
    }
    return {
      data: {
        popularProducts: popular.data,
        newProducts: newest.data,
      },
      success: true,
      message: 'Главные товары получены',
    };
  } catch (error: any) {
    const result = serverErrorHandler(error);

    return { data: result.data, success: result.success, message: result.message };
  }
};

export const getPopularProducts = async (limit = 5): Promise<IApiResponse<IProduct[]>> => {
  try {
    await connectMongoDB();

    const products: IProduct[] = await ProductModel.find({})
      .sort({ 'rating.value': -1 })
      .limit(limit);

    if (!products) {
      return { data: [], success: false, message: 'товары не найдены' };
    }

    return {
      data: JSON.parse(JSON.stringify(products)),
      success: true,
      message: 'Популярные товары получены',
    };
  } catch (error: any) {
    const result = serverErrorHandler(error);

    return { data: result.data, success: result.success, message: result.message };
  }
};

export const getNewProducts = async (limit = 5) => {
  try {
    await connectMongoDB();

    const products: IProduct[] = await ProductModel.find({}).sort({ createdAt: -1 }).limit(limit);

    if (!products) {
      return { data: [], success: false, message: 'товары не найдены' };
    }

    return {
      data: JSON.parse(JSON.stringify(products)),
      success: true,
      message: 'Популярные товары получены',
    };
  } catch (error: any) {
    const result = serverErrorHandler(error);

    return { data: result.data, success: result.success, message: result.message };
  }
};
