'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Plus, Minus } from 'lucide-react';
import {
  useCart,
  useUpdateCart,
  useRemoveFromCart,
} from '@/features/auth/hooks/useCart';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const { data: cartData, isLoading, isError } = useCart();
  const updateMutation = useUpdateCart();
  const removeMutation = useRemoveFromCart();

  const formatPrice = (price: number) => {
    return `Rp${(price || 0).toLocaleString('id-ID')}`;
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#F8F9FA] flex flex-col font-sans'>
        <Navbar />
        <main className='flex-grow pt-28 pb-16'>
          <div className='max-w-2xl mx-auto px-4 space-y-4'>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>My Cart</h1>
            <Skeleton className='h-48 w-full rounded-3xl' />
            <Skeleton className='h-48 w-full rounded-3xl' />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='min-h-screen bg-[#F8F9FA] flex flex-col font-sans'>
        <Navbar />
        <main className='flex-grow pt-28 pb-16 text-center text-red-500'>
          Failed to load cart. Please try again.
        </main>
        <Footer />
      </div>
    );
  }

  const groupedItems = cartData || [];

  return (
    <div className='min-h-screen bg-[#F8F9FA] flex flex-col font-sans'>
      <Navbar />

      <main className='flex-grow pt-28 pb-16'>
        <div className='max-w-2xl mx-auto px-4'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6'>My Cart</h1>

          {groupedItems.length === 0 ? (
            <div className='bg-white rounded-3xl p-10 text-center shadow-sm'>
              <p className='text-gray-500 mb-4'>Your cart is empty.</p>
              <Link
                href='/'
                className='inline-block bg-[#C40000] text-white px-6 py-2 rounded-full font-semibold hover:bg-red-800 transition'
              >
                Find Food
              </Link>
            </div>
          ) : (
            <div className='space-y-6'>
              {groupedItems.map((group: any, index: number) => {
                // Calculate total using item.menu.price
                const groupTotal = group.items.reduce(
                  (sum: number, item: any) =>
                    sum + (item.menu?.price || 0) * item.quantity,
                  0
                );

                return (
                  <div
                    key={group.restaurant?.id || index}
                    className='bg-white rounded-3xl p-6 md:p-8 shadow-sm'
                  >
                    {/* Restaurant Header */}
                    <div className='flex items-center gap-2 mb-6 cursor-pointer'>
                      {/* Logo fallback since Swagger doesn't show one */}
                      <div className='w-6 h-6 relative rounded overflow-hidden bg-orange-100 flex items-center justify-center'>
                        <span className='text-xs text-orange-500 font-bold'>
                          BK
                        </span>
                      </div>
                      {/* Use group.restaurant.name */}
                      <h2 className='font-bold text-gray-900 text-sm md:text-base'>
                        {group.restaurant?.name || 'Unknown Restaurant'}
                      </h2>
                      <ChevronRight size={16} className='text-gray-900' />
                    </div>

                    {/* Items List */}
                    <div className='space-y-6 mb-6'>
                      {group.items.map((item: any) => (
                        <div key={item.id} className='flex items-center gap-4'>
                          {/* Item Image */}
                          <div className='w-20 h-20 md:w-24 md:h-24 relative rounded-xl overflow-hidden shrink-0 bg-gray-50'>
                            <img
                              // Use item.menu.image
                              src={item.menu?.image || '/placeholder.png'}
                              alt={item.menu?.name || 'Menu Item'}
                              className='absolute inset-0 w-full h-full object-cover'
                            />
                          </div>

                          {/* Item Details */}
                          <div className='flex-1'>
                            {/* Use item.menu.name */}
                            <h3 className='font-medium text-gray-900 text-sm md:text-base'>
                              {item.menu?.foodName ||
                                item.menu?.name ||
                                'Unknown Item'}
                            </h3>
                            {/* Use item.menu.price */}
                            <p className='font-bold text-gray-900 mt-1'>
                              {formatPrice(item.menu?.price)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className='flex items-center gap-3'>
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateMutation.mutate({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  });
                                } else {
                                  removeMutation.mutate(item.id);
                                }
                              }}
                              disabled={updateMutation.isPending}
                              className='w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition'
                            >
                              <Minus size={14} className='text-gray-600' />
                            </button>
                            <span className='font-bold text-gray-900 text-sm w-4 text-center'>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  id: item.id,
                                  quantity: item.quantity + 1,
                                })
                              }
                              disabled={updateMutation.isPending}
                              className='w-7 h-7 rounded-full bg-[#C40000] flex items-center justify-center hover:bg-red-800 transition'
                            >
                              <Plus size={14} className='text-white' />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className='border-t border-dashed border-gray-200 my-6'></div>

                    {/* Footer / Total */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                      <div>
                        <p className='text-sm text-gray-500 mb-1'>Total</p>
                        <p className='text-lg md:text-xl font-bold text-gray-900'>
                          {formatPrice(groupTotal)}
                        </p>
                      </div>
                      <Link href='/checkout'>
                        <button className='bg-[#C40000] text-white font-medium py-2.5 px-12 rounded-full hover:bg-red-800 transition'>
                          Checkout
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
