import { clientErrorHandler } from '@/lib/utils/utils';

import { apiFetch } from '@/services/api/instance';
import { IApiResponse, IOrder, OrderCreateApi } from '@/types/types';

export const OrdersApi = {
  create: async (body: OrderCreateApi): Promise<IApiResponse<IOrder>> => {
    try {
      const response = await apiFetch.post<IApiResponse<IOrder>>('/order/create', {
        body,
      });

      return response;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
  getById: async (userId: string): Promise<IApiResponse<IOrder[]>> => {
    try {
      const response = await apiFetch.get<IApiResponse<IOrder[]>>(`/order/get?id=${userId}`);

      return response;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
};
