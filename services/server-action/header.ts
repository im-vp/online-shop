'use server';

import { serverErrorHandler } from '@/lib/utils/utils';
import { getCategories } from '@/services/api/categories';
import { getCartQuantity } from '@/services/server-action/actions';

export const getStaticData = async () => {
  try {
    const [categoriesResponse, cartQuantity] = await Promise.all([
      getCategories(),
      getCartQuantity(),
    ]);

    const categories = categoriesResponse?.data?.categories || [];

    return {
      categories,
      cartQuantity,
    };
  } catch (error) {
    const result = serverErrorHandler(error);
    return {
      categories: [],
      cartQuantity: 0,
      message: result.message,
    };
  }
};
