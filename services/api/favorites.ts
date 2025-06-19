import { clientErrorHandler } from '@/lib/utils/utils';

import { apiFetch } from '@/services/api/instance';
import { IApiResponse, IProduct } from '@/types/types';

export const FavoritesApi = {
  getAll: async (): Promise<IApiResponse<IProduct[]>> => {
    try {
      const response = await apiFetch.get<IApiResponse<IProduct[]>>('/favorites/get');

      return response;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
};
