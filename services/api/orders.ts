import { errorHandler } from '@/lib/utils/utils';

import { axiosInstance } from '@/services/api/instance';
import { IApiResponse, IOrder, OrderCreateApi } from '@/types/types';

export const OrdersApi = {
  create: async (body: OrderCreateApi) => {
    try {
      const { data } = await axiosInstance.post<IApiResponse<IOrder>>('/order/create', {
        ...body,
      });

      return data;
    } catch (error) {
      return { success: false, data: null, message: errorHandler(error) };
    }
  },
  getById: async (userId: string) => {
    try {
      const { data } = await axiosInstance.get<IApiResponse<IOrder[]>>(`/order/get?id=${userId}`);

      return data;
    } catch (error) {
      return { success: false, data: null, message: errorHandler(error) };
    }
  },
};
