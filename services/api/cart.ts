import { clientErrorHandler } from '@/lib/utils/utils';

import { apiFetch } from '@/services/api/instance';
import { CartRequestBody, IApiResponse, ICartResponse } from '@/types/types';

export const CartApi = {
  getCart: async (requestBody: CartRequestBody): Promise<IApiResponse<ICartResponse | null>> => {
    try {
      const { body } = await apiFetch.post<ICartResponse | null>('/cart/action', {
        body: requestBody,
      });

      return body;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
};
