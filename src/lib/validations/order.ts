import { z } from 'zod';

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Address must be at least 10 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  paymentMethod: z.enum(['BNI', 'BRI', 'BCA', 'MANDIRI']),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const reviewSchema = z.object({
  star: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(5, 'Review must be at least 5 characters'),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
