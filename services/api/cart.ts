import { errorHandler } from '@/lib/utils/utils';

import { apiFetch } from '@/services/api/instance';
import { CartRequestBody, IApiResponse, ICartResponse } from '@/types/types';

export const CartApi = {
  getCart: async (body: CartRequestBody): Promise<IApiResponse<ICartResponse | null>> => {
    try {
      const response = await apiFetch.post<IApiResponse<ICartResponse | null>>('/cart/action', {
        body,
      });

      return response;
    } catch (error) {
      return { success: false, data: null, message: errorHandler(error) };
    }
  },
};
