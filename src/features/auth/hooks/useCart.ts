import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';

// ✅ 1. Fetch Cart Query
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await api.get('/api/cart');
      // Extract the array based on your Swagger schema
      return (
        response.data?.data?.cart || []
      );
    },
  });
};

// ✅ 2. Add to Cart Mutation
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      restaurantId: string;
      menuId: string;
      quantity: number;
    }) => {
      console.log('🚀 Firing POST /api/cart with:', data);
      const response = await api.post('/api/cart', data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Backend confirmed. New cart data:', data);
      // This forces TanStack Query to re-fetch the cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      console.error('❌ Failed:', error?.response?.data || error.message);
      alert(
        'Failed to add to cart: ' +
          (error?.response?.data?.message || error.message)
      );
    },
  });
};

// ✅ 3. Update Quantity Mutation
export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await api.put(`/api/cart/${id}`, { quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// ✅ 4. Remove from Cart Mutation
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/cart/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
