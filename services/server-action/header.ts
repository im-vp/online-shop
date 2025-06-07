'use server';

import { serverErrorHandler } from '@/lib/utils/utils';

import { getCategories } from '@/services/api/categories';
import { getCartQuantity } from '@/services/server-action/actions';
import { ICategoriesResponse } from '@/types/types';

export const getStaticData = async () => {
  try {
    const [categoriesResponse, cartQuantity] = await Promise.all([
      getCategories(),
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
