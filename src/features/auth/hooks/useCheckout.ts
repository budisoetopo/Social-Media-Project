import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutOrder } from '@/lib/api/order';
import { useRouter } from 'next/navigation';

export const useCheckout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: checkoutOrder,
    onSuccess: () => {
      // ✅ CRITICAL: Clear the cart in the UI by invalidating the cart query
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      // Optional: Invalidate orders so the new order shows up in history
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      alert('Checkout successful!');
      router.push('/orders'); // Redirect to order history
    },
  });
};
