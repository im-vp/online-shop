import { ReviewsApi } from '@/services/api/reviews';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ReviewsApi.addReview,
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', _variables.productId] });
    },
  });
};
