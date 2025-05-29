import { errorHandler } from '@/lib/utils/utils';

import { axiosInstance } from '@/services/api/instance';
import { IApiResponse, IProduct, IProductResponse } from '@/types/types';

export const ProductApi = {
  getProductsBySearch: async (search: string): Promise<IApiResponse<IProduct[]>> => {
    try {
      const { data } = await axiosInstance.get<IApiResponse<IProduct[]>>(
        `/product/search?search=${search}`,
      );

      return data;
    } catch (error) {
      return { success: false, data: [], message: errorHandler(error) };
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
    return { success: false, data: {}, message: errorHandler(error) };
  }
};

export const getProduct = async (product: string): Promise<IApiResponse<IProduct>> => {
  try {
    const { data } = await axiosInstance.get<IApiResponse<IProduct>>(
      `/product/get?product=${product}`,
    );

    return data;
  } catch (error) {
    return { success: false, data: {}, message: errorHandler(error) };
  }
};
