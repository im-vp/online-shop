'use server';

import { connectMongoDB } from '@/lib/mongodb';
import { getObjectFilterParams, serverErrorHandler } from '@/lib/utils/utils';

import CategoriesModel from '@/models/categoriesModel';
import ProductModel from '@/models/productModel';
import {
  IApiResponse,
  ICategories,
  IHomeProductsParams,
  IHomeProductsResponse,
  IProduct,
} from '@/types/types';

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

export const getCategoryProducts = async (
  categoryName: string,
  searchParams?: { [key: string]: string },
) => {
  try {
    if (!categoryName)
      return {
        success: false,
        data: null,
        message: 'Не передана категория',
        status: 404,
      };
    const filterParams = getObjectFilterParams(searchParams ?? {}),
      sort = filterParams.sort ? filterParams.sort : 'rating',
      range = filterParams.range ? filterParams.range : null;

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

    const category: ICategories | null = await CategoriesModel.findOne({ slug: categoryName });

    if (!category) {
      return {
        success: false,
        data: null,
        message: 'Категория не найдена',
        status: 404,
      };
    }

    const filter: any = { category: category._id };

    if (range) filter.price = { $gte: range.min, $lte: range.max };

    const products: IProduct[] | null = await ProductModel.find(filter) //@ts-ignore
      .sort({ [sortObject[sort].field]: sortObject[sort].order })
      .populate({ path: 'category', model: CategoriesModel });

    if (!products) {
      return {
        success: false,
        data: null,
        message: 'Товары не найдены',
        status: 404,
      };
    }

    return {
      success: true,
      data: {
        products: JSON.parse(JSON.stringify(products)),
        productsQuantity: products.length,
        category: JSON.parse(JSON.stringify(category)),
      },
      message: 'Товары получены',
      status: 200,
    };
  } catch (error) {
    const result = serverErrorHandler(error);

    return {
      data: result.data,
      success: result.success,
      message: result.message,
      status: result.status,
    };
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
