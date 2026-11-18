import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  checkoutOrder,
  getMyOrders,
  createReview,
  getMyReviews,
} from '@/lib/api/order';
import { useRouter } from 'next/navigation';

export const useCheckout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      payload: any;
      summary: {
        price: number;
        deliveryFee: number;
        serviceFee: number;
        items: number;
        paymentMethod: string;
      };
    }) => checkoutOrder(data.payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      // Pass calculations to the Success Page
      const { price, deliveryFee, serviceFee, items, paymentMethod } =
        variables.summary;

      console.log('Redirecting to success with payment:', paymentMethod);

      router.push(
        `/checkout/success?price=${price}&delivery=${deliveryFee}&service=${serviceFee}&items=${items}&payment=${encodeURIComponent(paymentMethod)}`
      );
    },
  });
};

export const useOrderHistory = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getMyOrders,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useMyReviews = () => {
  return useQuery({
    queryKey: ['my-reviews'],
    queryFn: getMyReviews,
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: { star: number; comment: string };
    }) => updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
