import { z } from 'zod';

export const reviewSchema = z.object({
  star: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(5, 'Review must be at least 5 characters long'),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
