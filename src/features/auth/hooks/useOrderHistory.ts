import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getMyOrders, updateReview } from '@/lib/api/order';

export const useOrderHistory = (status?: string, page: number = 1) => {
  return useQuery({
    queryKey: ['orders', status, page], // When status or page changes, it refetches
    queryFn: () => getMyOrders(status, page),
    placeholderData: keepPreviousData, // Smooth pagination
  });
};
