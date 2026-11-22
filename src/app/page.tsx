'use client';

import Navbar from '@/components/layout/Navbar';
import Hero from '@/features/home/components/Hero';
import { useState } from 'react';
import Link from 'next/link';
import { useHomeRestaurants } from '@/features/auth/hooks/useHomeRestaurants';
import { imageHandler } from '../../public/images/imageHandler';
import Categories from '@/features/home/components/Categories';

const categories = [
  {
    name: 'All Restaurant',
    icon: '/images/all_restaurant.svg',
    slug: 'all-restaurant',
  },
  { name: 'Nearby', icon: '/images/nearby.svg', slug: 'nearby' },
  { name: 'Discount', icon: '/images/discount.svg', slug: 'discount' },
  { name: 'Best Seller', icon: '/images/best_seller.svg', slug: 'best-seller' },
  { name: 'Delivery', icon: '/images/delivery.svg', slug: 'delivery' },
  { name: 'Lunch', icon: '/images/lunch.svg', slug: 'lunch' },
];

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: restaurants = [],
    isLoading,
    isError,
  } = useHomeRestaurants(searchQuery);

  return (
    <div className='min-h-screen w-full bg-white flex flex-col font-sans'>
      <Navbar />

      <main className='flex-grow flex flex-col items-center w-full'>
        {/* 1. HERO: search function */}
        <Hero onSearch={setSearchQuery} />

        {/* 2. MIDDLE SECTION: White background with rounded top overlapping the Hero */}
        <div className='w-full bg-white flex flex-col items-center pb-20 relative z-10 -mt-8'>
          {/* CATEGORIES */}
          <div className='w-full max-w-5xl mx-auto px-4 py-8'>
            <div className='grid grid-cols-3 md:grid-cols-6 gap-4'>
              {categories.map((cat) => (
                <Link href={`/category/${cat.slug}`} key={cat.name}>
                  <div className='flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition h-full'>
                    <img
                      src={imageHandler(cat.icon)}
                      alt={cat.name}
                      className='w-8 h-8 md:w-10 md:h-10 object-contain mb-2'
                    />

                    <span className='text-xs font-medium text-gray-700 text-center'>
                      {cat.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RECOMMENDED */}
          <div className='w-full max-w-5xl mx-auto px-4 py-4'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                {searchQuery ? `Results for "${searchQuery}"` : 'Recommended'}
              </h2>
              <button className='text-red-500 font-semibold text-sm hover:underline'>
                See All
              </button>
            </div>

            {/* TanStack Query Loading State */}
            {isLoading && (
              <p className='text-center text-gray-500 py-10'>
                Loading restaurants...
              </p>
            )}

            {/* TanStack Query Error State */}
            {isError && (
              <p className='text-center text-red-500 py-10'>
                Failed to fetch restaurants. Please try again.
              </p>
            )}

            {!isLoading && !isError && (
              <>
                {restaurants.length === 0 ? (
                  <p className='text-center text-gray-500 py-10'>
                    No restaurants found.
                  </p>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {restaurants.map((resto) => (
                      <Link href={`/resto/${resto.id}`} key={resto.id}>
                        <div className='flex items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition cursor-pointer h-full'>
                          <div className='w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 font-bold text-xl mr-4 shrink-0 overflow-hidden'>
                            {resto.image ? (
                              <img
                                src={resto.image}
                                alt={resto.name}
                                className='w-full h-full object-cover'
                              />
                            ) : (
                              'BK'
                            )}
                          </div>
                          <div className='flex flex-col overflow-hidden w-full'>
                            <h3 className='font-bold text-gray-900 text-lg truncate'>
                              {resto.name}
                            </h3>
                            <div className='flex items-center text-sm text-gray-600 mt-1'>
                              <span className='text-yellow-500 mr-1'>★</span>
                              <span className='font-medium mr-2'>
                                {resto.rating}
                              </span>
                            </div>
                            <p className='text-xs text-gray-400 mt-1 truncate'>
                              {resto.location} • {resto.distance || '2.4 km'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
