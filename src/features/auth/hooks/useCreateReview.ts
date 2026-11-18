import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '@/lib/api/review';

export const useCreateReview = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      // This make the reviews list to refresh with the new review!
      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });
    },
  });
};
