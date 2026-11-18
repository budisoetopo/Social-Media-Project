'use client';

import { useState } from 'react';
import { useRestaurants } from '@/features/auth/hooks/useRestaurant';
import { FilterSidebar } from '@/components/shared/FilterSidebar';
import { RestaurantCard } from '@/components/shared/RestaurantCard';
import { CategorySlug } from '@/types/resto';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { filter_lines } from '../../../../../public/images/imageHandler';

export function CategoryContent({ category }: { category: CategorySlug }) {
  const {
    data: restaurants,
    isLoading,
    isError,
    error,
  } = useRestaurants(category);
  const isMobileFilterOpen = useUIStore((state) => state.isMobileFilterOpen);
  const setMobileFilterOpen = useUIStore((state) => state.setMobileFilterOpen);

  const pageTitle = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const isUnauthorized = isError && (error as any)?.response?.status === 401;

  const isLocationError =
    isError &&
    (error as any)?.response?.data?.message?.toLowerCase().includes('location');

  return (
    <div className='min-h-screen w-full bg-[#fafafa] flex flex-col font-sans'>
      <Navbar />

      <main className='flex-grow w-full max-w-360 mx-auto px-30 pt-20 pb-12 relative'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900'>{pageTitle}</h1>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className='md:hidden w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm mb-6 transition-all active:scale-[0.98]'
        >
          <span className='text-sm font-bold text-black tracking-wide uppercase'>
            Filter
          </span>
          <img
            src={filter_lines}
            alt='filter'
            className='w-5 h-5 object-contain'
          />
        </button>

        {/* Sidebar and Grid */}
        <div className='flex flex-col md:flex-row gap-8 items-start'>
          {/* Desktop Sidebar */}
          <aside className='hidden md:block w-[280px] shrink-0 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm'>
            <h2 className='font-bold text-sm text-gray-900 mb-6 uppercase tracking-wide'>
              Filter
            </h2>
            <FilterSidebar />
          </aside>

          {/* Mobile Sidebar Overlay */}
          {isMobileFilterOpen && (
            <div className='fixed inset-0 z-[60] bg-black/40 md:hidden flex justify-end'>
              <div className='w-[85%] max-w-[320px] bg-white h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200'>
                <div className='p-6'>
                  <div className='flex justify-between items-center mb-6'>
                    <h2 className='font-bold text-lg text-black'>Filter</h2>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className='p-1.5 hover:bg-gray-100 rounded-full transition-colors'
                    >
                      <X size={24} className='text-gray-800' />
                    </button>
                  </div>
                  <FilterSidebar />
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className='flex-1 w-full'>
            {isUnauthorized ? (
              <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm text-center'>
                <div className='w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 text-2xl'>
                  🔒
                </div>
                <h2 className='text-xl font-bold text-gray-900 mb-2'>
                  Login Required
                </h2>
                <p className='text-gray-500 mb-6 max-w-sm'>
                  You need to be logged in to view restaurants near your
                  location.
                </p>
                <button
                  onClick={() => (window.location.href = '/login')}
                  className='px-6 py-2.5 bg-[#DA2E28] text-white font-medium rounded-full hover:bg-red-700 transition'
                >
                  Go to Login
                </button>
              </div>
            ) : isLocationError ? (
              <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm text-center'>
                <div className='w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4 text-2xl'>
                  📍
                </div>
                <h2 className='text-xl font-bold text-gray-900 mb-2'>
                  Location Required
                </h2>
                <p className='text-gray-500 mb-6 max-w-sm'>
                  {/* Display the exact message from the backend */}
                  {(error as any)?.response?.data?.message ||
                    'Please update your location in your profile to see nearby restaurants.'}
                </p>
                <button
                  onClick={() => (window.location.href = '/profile')}
                  className='px-6 py-2.5 bg-[#DA2E28] text-white font-medium rounded-full hover:bg-red-700 transition'
                >
                  Go to Profile
                </button>
              </div>
            ) : isError ? (
              <div className='p-8 text-center bg-white rounded-2xl border border-red-100 text-red-500'>
                <p className='font-bold text-lg'>Failed to load restaurants.</p>
                <pre className='mt-4 text-left text-xs bg-gray-50 p-4 rounded text-black overflow-auto max-w-2xl mx-auto'>
                  {error instanceof Error
                    ? error.message
                    : JSON.stringify(error, null, 2)}
                </pre>
              </div>
            ) : isLoading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className='h-[120px] w-full rounded-2xl' />
                ))}
              </div>
            ) : restaurants?.length === 0 ? (
              <div className='text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-500'>
                No restaurants found for this category.
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {restaurants?.map((resto: any) => (
                  <RestaurantCard key={resto.id} restaurant={resto} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
