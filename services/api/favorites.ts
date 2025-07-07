import { clientErrorHandler } from '@/lib/utils/utils';

import { apiFetch } from '@/services/api/instance';
import { IApiResponse, IProduct } from '@/types/types';

export const FavoritesApi = {
  getAll: async (): Promise<IApiResponse<IProduct[]>> => {
    try {
      const { body } = await apiFetch.get<IProduct[]>('/favorites/get');

      return body;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
};
