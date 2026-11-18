import { useQuery } from '@tanstack/react-query';
import { getRestaurantReviews } from '@/lib/api/resto';

export const useRestaurantReviews = (restaurantId: string) => {
  return useQuery({
    queryKey: ['reviews', restaurantId],
    queryFn: () => getRestaurantReviews(restaurantId),
    enabled: !!restaurantId,
  });
};
