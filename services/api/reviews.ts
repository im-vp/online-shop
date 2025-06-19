import { clientErrorHandler } from '@/lib/utils/utils';

import { apiFetch } from '@/services/api/instance';
import { IApiResponse, IReviews, IReviewsBody } from '@/types/types';

export const ReviewsApi = {
  getProductReviews: async (id: string): Promise<IApiResponse<IReviews[]>> => {
    try {
      const response = await apiFetch.get<IApiResponse<IReviews[]>>(`/reviews/get/${id}`);

      return response;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
  addReview: async (body: IReviewsBody): Promise<IApiResponse> => {
    try {
      const response = await apiFetch.post<IApiResponse>('/reviews/add', {
        body,
      });

      return response;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
};
