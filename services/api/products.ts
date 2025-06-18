import { clientErrorHandler, errorHandler } from '@/lib/utils/utils';

import { apiFetch, axiosInstance } from '@/services/api/instance';
import { IApiResponse, IProduct, IProductResponse } from '@/types/types';

export const ProductApi = {
  getProductsBySearch: async (search: string): Promise<IApiResponse<IProduct[]>> => {
    try {
      const { data } = await axiosInstance.get<IApiResponse<IProduct[]>>(
        `/product/search?search=${search}`,
      );

      return data;
    } catch (error) {
      return { success: false, data: null, message: errorHandler(error) };
    }
  },
  getProduct: async (slug: string): Promise<IApiResponse<IProduct>> => {
    try {
      const response = await apiFetch.get<IApiResponse<IProduct>>(`/product/get/${slug}`, {
        next: {
          revalidate: 1800,
        },
      });

      return response;
    } catch (error) {
      return await clientErrorHandler(error);
    }
  },
};

export const getProducts = async (
  category: string,
  params?: string,
): Promise<IApiResponse<IProductResponse>> => {
  try {
    const newParams = params?.split('?')[1] || '';
    const { data } = await axiosInstance.get<IApiResponse<IProductResponse>>(
      `/product/get-all?category=${category}&${newParams}`,
    );

    return data;
  } catch (error) {
    //@ts-ignore
    return { success: false, data: null, message: errorHandler(error) };
  }
};
