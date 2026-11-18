import { useQuery } from '@tanstack/react-query';
import { getRestaurantDetail } from '@/lib/api/resto';

export const useRestaurantDetail = (id: string) => {
  return useQuery({
    queryKey: ['resto', id], // The ID is in the key, so it refetches if the ID changes
    queryFn: () => getRestaurantDetail(id),
    enabled: !!id, // Don't run the query if the ID is missing
  });
};
