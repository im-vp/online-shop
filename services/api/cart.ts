import { errorHandler } from '@/lib/utils/utils';

import { axiosInstance } from '@/services/api/instance';
import { CartRequestBody, IApiResponse, ICartResponse } from '@/types/types';

export const CartApi = {
  getCart: async (body: CartRequestBody): Promise<IApiResponse<ICartResponse | null>> => {
    try {
      const { data } = await axiosInstance.post<IApiResponse<ICartResponse | null>>(
        'cart/action',
        body,
      );

      return data;
    } catch (error) {
      return { success: false, data: null, message: errorHandler(error) };
    }
  },
};
