import { clientErrorHandler } from '@/lib/utils/utils';

import { apiFetch } from '@/services/api/instance';
import { IApiResponse, IOrder, OrderCreateApi } from '@/types/types';

export const OrdersApi = {
  create: async (requestBody: OrderCreateApi): Promise<IApiResponse<IOrder>> => {
    try {
      const { body } = await apiFetch.post<IOrder>('/order/create', {
        body: requestBody,
      });

      return body;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
  getById: async (userId: string): Promise<IApiResponse<IOrder[]>> => {
    try {
      const { body } = await apiFetch.get<IOrder[]>(`/order/get?id=${userId}`);

      return body;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
};
