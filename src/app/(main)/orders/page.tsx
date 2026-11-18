'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, X, Search, MapPin, FileText, LogOut } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  useOrderHistory,
  useCreateReview,
  useUpdateReview,
  useMyReviews,
} from '@/features/auth/hooks/useOrder';
import { useAuthStore } from '@/store/authStore';
import { reviewSchema, ReviewFormValues } from '@/lib/validations/order';
import { Avatar_Image } from '../../../../public/images/imageHandler'; // Adjust path if necessary

export default function MyOrdersPage() {
  const { user, signOut } = useAuthStore();
  const { data: orders, isLoading } = useOrderHistory();
  const { data: myReviews } = useMyReviews();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewOrder, setReviewOrder] = useState<any>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0);

  // Added the new status tabs from the Figma design
  const tabs = [
    'Status',
    'Preparing',
    'On The Way',
    'Delivered',
    'Done',
    'Canceled',
  ];

  // Filter Logic
  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter((order: any) => {
    // 1. Fix the search to look inside the restaurants array
    const restName =
      order.restaurants?.[0]?.restaurant?.name ||
      order.restaurants?.[0]?.name ||
      '';
    const matchesSearch = restName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Fix the tab filter to include 'DONE' (your API uses 'done')
    const currentStatus = (order.status || '').toUpperCase();
    if (activeTab === 'All' || activeTab === 'Status') return true;
    if (activeTab === 'Preparing')
      return ['PENDING', 'PROCESSING'].includes(currentStatus);
    if (activeTab === 'On The Way')
      return ['ON_DELIVERY', 'DELIVERING'].includes(currentStatus);
    if (activeTab === 'Delivered' || activeTab === 'Done')
      return ['COMPLETED', 'SUCCESS', 'DONE'].includes(currentStatus);
    if (activeTab === 'Canceled')
      return ['CANCELED', 'CANCELLED'].includes(currentStatus);
    return true;
  });

  return (
    <div className='min-h-screen bg-[#F8F9FA] flex flex-col font-sans'>
      <Navbar />

      <main className='flex-grow pt-28 pb-16'>
        <div className='max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-6 items-start'>
          {/* ✅ ADDED: Left Sidebar matching Figma */}
          <aside className='w-full md:w-[280px] shrink-0 bg-white rounded-3xl p-5 shadow-sm border border-gray-100'>
            <div className='flex items-center gap-3 mb-6 px-2'>
              <div className='w-12 h-12 rounded-full overflow-hidden relative border border-gray-200'>
                <Image
                  src={user?.avatar || Avatar_Image}
                  alt='User'
                  fill
                  className='object-cover'
                />
              </div>
              <span className='font-bold text-gray-900'>
                {user?.name || 'John Doe'}
              </span>
            </div>

            <div className='flex flex-col gap-1'>
              <button className='flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition text-left'>
                <MapPin size={18} className='text-gray-400' /> Delivery Address
              </button>
              <button className='flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-[#C40000] bg-red-50 transition text-left'>
                <FileText size={18} /> My Orders
              </button>
              <button
                onClick={signOut}
                className='flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition text-left'
              >
                <LogOut size={18} className='text-gray-400' /> Logout
              </button>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className='flex-1 w-full bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100'>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>My Orders</h1>

            {/* Search Bar */}
            <div className='relative w-full mb-6'>
              <Search
                className='absolute left-4 top-3.5 text-gray-400'
                size={18}
              />
              <input
                type='text'
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-white'
              />
            </div>

            {/* Horizontal Status Tabs */}
            <div className='flex items-center gap-3 md:gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide'>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap text-sm font-medium transition-colors px-4 py-2 rounded-full ${
                    activeTab === tab
                      ? 'bg-red-50 text-[#C40000] border border-red-200'
                      : 'text-gray-500 hover:text-gray-900 border border-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Order List */}
            <div className='space-y-6'>
              {isLoading ? (
                <div className='text-center py-10 text-gray-500'>
                  Loading orders...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className='text-center py-10 text-gray-500'>
                  No orders found.
                </div>
              ) : (
                filteredOrders.map((order: any) => {
                  const orderTotal = order.pricing?.totalPrice || 0;
                  const orderStatus = (order.status || 'PENDING').toUpperCase();

                  const primaryResto = order.restaurants?.[0];
                  const restaurantName =
                    primaryResto?.restaurant?.name ||
                    primaryResto?.name ||
                    'Restaurant';
                  const restaurantLogo =
                    primaryResto?.restaurant?.logo || primaryResto?.logo;

                  const currentTransactionId = String(
                    order.transactionId || order.id
                  );

                  const existingReview = myReviews?.find(
                    (r: any) => String(r.transactionId) === currentTransactionId
                  );

                  const isReviewed =
                    !!existingReview ||
                    order.status === 'reviewed' ||
                    order.isReviewed;

                  const isDone = ['COMPLETED', 'SUCCESS', 'DONE'].includes(
                    orderStatus
                  );

                  const items =
                    primaryResto?.items ||
                    primaryResto?.restaurant?.items ||
                    order.items ||
                    [];

                  return (
                    <div
                      key={order.id}
                      className='border border-gray-100 rounded-2xl p-6 shadow-sm'
                    >
                      {/* Restaurant Header */}
                      <div className='flex items-center gap-2 mb-4'>
                        <div className='w-6 h-6 rounded overflow-hidden relative bg-orange-100 flex items-center justify-center shrink-0'>
                          <img
                            src={restaurantLogo || '/images/bk_logo.svg'}
                            alt='logo'
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <h3 className='font-bold text-gray-900'>
                          {restaurantName}
                        </h3>
                      </div>

                      {/* Items List matching Figma */}
                      <div className='space-y-4 mb-6'>
                        {items.map((item: any, index: number) => {
                          const itemName =
                            item.menu?.foodName ||
                            item.menu?.name ||
                            'Food Name';
                          const itemPrice = item.menu?.price || 0;
                          const itemImage =
                            item.menu?.image || '/images/main_dish1.png';

                          return (
                            <div
                              key={item.id || item.menu?.id || index}
                              className='flex items-center gap-4'
                            >
                              <div className='w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-gray-100'>
                                <img
                                  src={itemImage}
                                  alt={itemName}
                                  className='w-full h-full object-cover'
                                />
                              </div>
                              <div>
                                <p className='text-sm text-gray-900 font-medium'>
                                  {itemName}
                                </p>
                                <p className='text-sm font-bold text-gray-900 mt-1'>
                                  {item.quantity} x {formatPrice(itemPrice)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer matching Figma */}
                      <div className='border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div>
                          <p className='text-xs text-gray-500 mb-1'>Total</p>
                          <p className='font-bold text-lg text-gray-900'>
                            {formatPrice(orderTotal)}
                          </p>
                        </div>

                        {isReviewed ? (
                          <button
                            onClick={() =>
                              setReviewOrder({ ...order, existingReview })
                            }
                            className='text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition cursor-pointer'
                          >
                            ✓ Reviewed (Click to Edit)
                          </button>
                        ) : isDone ? (
                          <button
                            onClick={() =>
                              setReviewOrder({ ...order, existingReview: null })
                            }
                            className='bg-[#C40000] text-white px-8 py-2 rounded-full text-sm font-bold hover:bg-red-800 transition'
                          >
                            Give Review
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* REVIEW MODAL */}
      {reviewOrder && (
        <ReviewModal order={reviewOrder} onClose={() => setReviewOrder(null)} />
      )}

      <Footer />
    </div>
  );
}

// ---------------- REVIEW MODAL COMPONENT ----------------
function ReviewModal({ order, onClose }: { order: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [hoveredStar, setHoveredStar] = useState(0);

  // + 1. Use both Create and Update hooks
  const { mutate: createReview, isPending: isCreating } = useCreateReview();
  const { mutate: editReview, isPending: isEditing } = useUpdateReview();

  // + 2. Check if the API sent back an existing review
  const existingReview = order.existingReview;
  const isEditMode = !!existingReview;
  const isPending = isCreating || isEditing;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    // + 3. Pre-fill the form if editing
    defaultValues: {
      star: existingReview?.star || 0,
      comment: existingReview?.comment || '',
    },
  });

  const currentStar = watch('star');

  const onSubmit = (values: ReviewFormValues) => {
    const realRestaurantId = order.restaurants?.[0]?.restaurant?.id;
    const realTransactionId = order.transactionId || order.id;

    // + 4. Branch the logic based on Create vs Edit
    if (isEditMode) {
      editReview(
        {
          id: existingReview.id,
          data: { star: values.star, comment: values.comment },
        },
        {
          onSuccess: () => {
            alert('Review updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['my-reviews'] }); // Refresh reviews
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            onClose();
          },
          onError: (error: any) => {
            alert(
              'Failed to update: ' +
                (error.response?.data?.message || error.message)
            );
          },
        }
      );
    } else {
      // CREATE NEW REVIEW
      createReview(
        {
          transactionId: realTransactionId,
          restaurantId: realRestaurantId,
          star: values.star,
          comment: values.comment,
        },
        {
          onSuccess: () => {
            alert('Review submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['my-reviews'] }); // Refresh reviews
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            onClose();
          },
          onError: (error: any) => {
            alert(
              'Failed to submit: ' +
                (error.response?.data?.message || error.message)
            );
          },
        }
      );
    }
  };

  return (
    <div className='fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-3xl w-full max-w-[450px] p-6 relative animate-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold text-black'>
            {/* + 5. Dynamic Header Text */}
            {isEditMode ? 'Edit Review' : 'Give Review'}
          </h2>
          <button
            onClick={onClose}
            className='p-1 hover:bg-gray-100 rounded-full transition'
          >
            <X size={24} className='text-gray-600' />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Rating Section */}
          <div className='flex flex-col items-center'>
            <p className='text-sm font-bold text-black mb-3'>Give Rating</p>
            <div className='flex gap-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() =>
                    setValue('star', star, { shouldValidate: true })
                  }
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className='p-1 transition-transform'
                >
                  <Star
                    size={36}
                    className={
                      star <= (hoveredStar || currentStar)
                        ? 'text-[#F5A623] fill-[#F5A623]'
                        : 'text-[#C4C4C4] fill-[#C4C4C4]'
                    }
                  />
                </button>
              ))}
            </div>
            {errors.star && (
              <p className='text-red-500 text-xs mt-1'>{errors.star.message}</p>
            )}
          </div>

          {/* Comment Textarea */}
          <div>
            <textarea
              {...register('comment')}
              rows={6}
              placeholder='Please share your thoughts about our service!'
              className='w-full p-4 bg-white border border-[#D9D9D9] rounded-2xl focus:ring-1 focus:ring-[#C40000] focus:border-[#C40000] outline-none text-sm resize-none text-black placeholder:text-gray-400'
            />
            {errors.comment && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.comment.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isPending}
            className='w-full bg-[#C40000] text-white font-bold py-4 rounded-full text-lg hover:bg-[#a30000] transition disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {/* + 6. Dynamic Button Text */}
            {isPending ? 'Sending...' : isEditMode ? 'Update Review' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
