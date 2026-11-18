'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Star, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useRestaurantReviews } from '@/features/auth/hooks/useRestaurantReviews';
import { ReviewForm } from '@/features/auth/components/ReviewForm';

export default function AllReviewsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  // The API requires a transactionId to submit a review.
  // If the user comes from the order history, it will be in the URL.
  const transactionId = searchParams.get('transactionId');

  // ✅ Fetch existing reviews (Server State)
  const { data: reviews, isLoading, isError } = useRestaurantReviews(id);

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col font-sans'>
      <Navbar />

      <main className='flex-grow pt-24 pb-16'>
        <div className='max-w-6xl mx-auto px-4 md:px-6'>
          {/* Header with Back Button */}
          <div className='flex items-center gap-4 mb-8'>
            <button
              onClick={() => router.back()}
              className='p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition'
            >
              <ArrowLeft size={20} className='text-gray-700' />
            </button>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              Reviews
            </h1>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start'>
            {/* LEFT COLUMN: Existing Reviews List */}
            <div className='space-y-6'>
              <h2 className='text-xl font-bold text-gray-900'>
                What people are saying
              </h2>

              {/* Loading State */}
              {isLoading && (
                <div className='text-center py-10 text-gray-500'>
                  Loading reviews...
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className='text-center py-10 text-red-500'>
                  Failed to load reviews. Please try again.
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !isError && reviews?.length === 0 && (
                <div className='bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500'>
                  No reviews yet. Be the first to review!
                </div>
              )}

              {/* Review List */}
              {!isLoading && !isError && reviews?.length > 0 && (
                <div className='space-y-4'>
                  {reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4'
                    >
                      {/* Avatar */}
                      <div className='w-12 h-12 rounded-full overflow-hidden relative shrink-0 bg-gray-200'>
                        <img
                          src={
                            review.user?.avatar || '/images/default_avatar.png'
                          }
                          alt={review.user?.name || 'User'}
                          className='absolute inset-0 w-full h-full object-cover'
                        />
                      </div>

                      {/* Content */}
                      <div className='flex-1'>
                        <h4 className='font-bold text-gray-900 text-sm'>
                          {review.user?.name || 'Anonymous'}
                        </h4>
                        <p className='text-xs text-gray-400 mt-0.5 mb-2'>
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString(
                                'id-ID',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )
                            : 'Recently'}
                        </p>

                        {/* Stars */}
                        <div className='flex gap-1 mb-3'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.star
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>

                        <p className='text-gray-600 text-sm leading-relaxed'>
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Write a Review Form */}
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>
                Write a Review
              </h2>

              {/* 
                The API requires a transactionId to prove the user bought food.
                If the user navigated here without an order ID, we show a message.
              */}
              {transactionId ? (
                <ReviewForm restaurantId={id} transactionId={transactionId} />
              ) : (
                <div className='text-center p-4 bg-orange-50 rounded-xl border border-orange-100'>
                  <p className='text-sm text-orange-800'>
                    You can only write a review after completing an order.
                    Please check your Order History to leave a review.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
