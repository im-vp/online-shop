import { errorHandler } from '@/lib/utils/utils';

import { axiosInstance } from '@/services/api/instance';
import { IApiResponse, IReviews } from '@/types/types';

export const addReview = async (body: {
  user: string;
  reviewText: string;
  rating: number;
  product: string;
}): Promise<IApiResponse> => {
  try {
    const { data } = await axiosInstance.post<IApiResponse>('/reviews', {
      ...body,
    });

    return data;
  } catch (error) {
    return { success: false, data: null, message: errorHandler(error) };
  }
};
