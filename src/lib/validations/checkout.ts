import { z } from 'zod';

export const checkoutSchema = z.object({
  deliveryAddress: z
    .string()
    .min(10, 'Address must be at least 10 characters long'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .optional()
    .or(z.literal('')),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'E_WALLET']),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
