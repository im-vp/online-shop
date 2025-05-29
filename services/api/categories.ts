import { errorHandler } from '@/lib/utils/utils';

import { axiosInstance } from '@/services/api/instance';
import { IApiResponse, ICategoriesResponse } from '@/types/types';

export const getCategories = async (): Promise<IApiResponse<ICategoriesResponse>> => {
  try {
    const { data } =
      await axiosInstance.get<IApiResponse<ICategoriesResponse>>('/categories/get-all');

    return data;
  } catch (error) {
    //@ts-ignore
    return { success: false, data: null, message: errorHandler(error) };
  }
};

export const createCategory = async (request: any) => {
  const { data } = await axiosInstance.post('/categories/create', {
    request,
  });
  return data;
};
