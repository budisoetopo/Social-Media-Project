'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { reviewSchema, type ReviewFormValues } from '@/lib/validations/review';
import { useCreateReview } from '../hooks/useCreateReview';

interface ReviewFormProps {
  restaurantId: string;
  transactionId: string;
}

export function ReviewForm({ restaurantId, transactionId }: ReviewFormProps) {
  const router = useRouter();
  const [hoveredStar, setHoveredStar] = useState(0);

  // ✅ Server State Mutation
  const { mutate, isPending, isError, error } = useCreateReview(restaurantId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { star: 0, comment: '' },
  });

  const currentRating = watch('star');

  const onSubmit = (values: ReviewFormValues) => {
    mutate(
      {
        restaurantId,
        transactionId,
        star: values.star,
        comment: values.comment,
      },
      {
        onSuccess: () => {
          alert('Review submitted successfully!');
          router.push(`/resto/${restaurantId}`); // Go back to restaurant page
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 max-w-lg mx-auto'
    >
      {/* Star Rating */}
      <div>
        <label className='block text-sm font-bold text-gray-900 mb-2'>
          Rating
        </label>
        <div className='flex gap-2'>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type='button'
              onClick={() => setValue('star', star, { shouldValidate: true })}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className='p-1 transition-transform hover:scale-110'
            >
              <Star
                size={32}
                className={`${
                  star <= (hoveredStar || currentRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        {errors.star && (
          <p className='text-red-500 text-xs mt-1'>{errors.star.message}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className='block text-sm font-bold text-gray-900 mb-2'>
          Review
        </label>
        <textarea
          {...register('comment')}
          rows={4}
          placeholder='Tell us about your experience...'
          className='w-full p-4 border border-gray-300 rounded-xl focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition'
        />
        {errors.comment && (
          <p className='text-red-500 text-xs mt-1'>{errors.comment.message}</p>
        )}
      </div>

      {/* Error Handling */}
      {isError && (
        <div className='p-3 bg-red-50 text-red-600 text-sm rounded-lg'>
          {(error as any)?.response?.data?.message ||
            'Failed to submit review. Please try again.'}
        </div>
      )}

      {/* Submit Button */}
      <button
        type='submit'
        disabled={isPending}
        className='w-full bg-[#C40000] text-white font-bold py-3 rounded-xl hover:bg-red-800 transition disabled:opacity-70'
      >
        {isPending ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
