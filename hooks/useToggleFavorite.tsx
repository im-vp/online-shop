import { toggleFavorite } from '@/services/server-action/favorites';
import { IProduct } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (_data, productId) => {
      queryClient.setQueryData(['userFavorites'], (old: any) => {
        const current: IProduct[] = old?.data || [];
        const exists = current.some((item) => item._id === productId);
        
        if (!exists) return old;

        return {
          ...old,
          data: current.filter((item) => item._id !== productId),
        };
      });
    },
  });
};
