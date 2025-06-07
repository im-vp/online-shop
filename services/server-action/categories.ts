'use server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import CategoriesSchema from '@/models/categoriesModel';
import { IApiResponse, ICategories, ICategoriesResponse } from '@/types/types';

export const getAllCategories = async (
  isShowHidden = false,
): Promise<IApiResponse<ICategoriesResponse>> => {
  const getCategoriesParams = isShowHidden ? {} : { display: true };
  try {
    await connectMongoDB();
    const categories: ICategories[] = await CategoriesSchema.find(getCategoriesParams);

    if (!categories) {
      return {
        success: false,
        data: null,
        message: 'Категории не найдены',
        status: 404,
      };
    }

    return {
      success: true,
      data: {
        categories: JSON.parse(JSON.stringify(categories)),
        categoriesQuantity: categories.length,
      },
      message: 'Категории найдены',
      status: 200,
    };
  } catch (error) {
    const result = serverErrorHandler(error);

    return {
      success: result.success,
      data: result.data,
      message: result.message,
      status: result.status,
    };
  }
};
