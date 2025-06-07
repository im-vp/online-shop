'use server';

import { serverErrorHandler } from '@/lib/utils/utils';

import { getCartQuantity } from '@/services/server-action/actions';
import { getAllCategories } from '@/services/server-action/categories';
import { ICategoriesResponse } from '@/types/types';

export const getStaticData = async () => {
  try {
    const [categoriesResponse, cartQuantity] = await Promise.all([
      getAllCategories(),
      getCartQuantity(),
    ]);

    const categoriesInfo = (categoriesResponse.success && categoriesResponse.data) || {
      categories: [],
      categoriesQuantity: 0,
    };

    return {
      categoriesInfo,
      cartQuantity,
    };
  } catch (error) {
    const result = serverErrorHandler(error);
    return {
      success: result.success,
      categoriesInfo: {
        categories: [],
        categoriesQuantity: 0,
      } as ICategoriesResponse,
      cartQuantity: 0,
      message: result.message,
    };
  }
};
