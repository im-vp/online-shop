import { clientErrorHandler } from '@/lib/utils/utils';

import { apiFetch } from '@/services/api/instance';
import { IApiResponse, IProduct, IProductResponse } from '@/types/types';

export const ProductApi = {
  getProductsBySearch: async (search: string): Promise<IApiResponse<IProduct[]>> => {
    try {
      const response = await apiFetch.get<IApiResponse<IProduct[]>>(
        `/product/search?search=${search}`,
      );

      return response;
    } catch (error) {
      return await clientErrorHandler(error);
    }
  },
  getProduct: async (slug: string): Promise<IApiResponse<IProduct>> => {
    try {
      const response = await apiFetch.get<IApiResponse<IProduct>>(`/product/get/${slug}`, {
        next: {
          revalidate: 1800,
          tags: [`product-${slug}`],
        },
      });

      return response;
    } catch (error) {
      return await clientErrorHandler(error);
    }
  },
  getProducts: async (
    category: string,
    params?: string,
  ): Promise<IApiResponse<IProductResponse>> => {
    try {
      const newParams = params?.split('?')[1] || '';
      const response = await apiFetch.get<IApiResponse<IProductResponse>>(
        `/product/get-all?category=${category}&${newParams}`,
      );

      return response;
    } catch (error) {
      return await clientErrorHandler(error);
    }
  },
};
