import { clientErrorHandler } from '@/lib/utils/utils';

import { apiFetch } from '@/services/api/instance';
import { IApiResponse, IReviews, IReviewsBody } from '@/types/types';

export const ReviewsApi = {
  getProductReviews: async (id: string): Promise<IApiResponse<IReviews[]>> => {
    try {
      const { body } = await apiFetch.get<IReviews[]>(`/reviews/get/${id}`);

      return body;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
  addReview: async (requestBody: IReviewsBody): Promise<IApiResponse> => {
    try {
      const { body } = await apiFetch.post('/reviews/add', {
        body: requestBody,
      });

      return body;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
};
