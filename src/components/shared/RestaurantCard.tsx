import Link from 'next/link';
import { Restaurant } from '@/types/resto';
import { Card, CardContent } from '@/components/ui/card';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/resto/${restaurant.id}`} className='block w-full'>
      <Card className='flex flex-row items-center p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white h-full'>
        {/* Image Container - White background, subtle border */}
        <div className='w-20 h-20 md:w-24 md:h-24 shrink-0 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden'>
          {restaurant.image ? (
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className='w-full h-full object-contain p-2'
            />
          ) : (
            <span className='text-gray-400 font-bold'>BK</span>
          )}
        </div>

        {/* Content Container */}
        <div className='flex flex-col ml-4 overflow-hidden w-full justify-center'>
          <h3 className='font-bold text-gray-900 text-base md:text-lg truncate'>
            {restaurant.name}
          </h3>
          <div className='flex items-center gap-1.5 mt-1 text-sm text-gray-600'>
            <span className='text-yellow-500 text-lg leading-none'>★</span>
            <span className='font-medium text-gray-800'>
              {restaurant.rating}
            </span>
          </div>
          <p className='text-xs md:text-sm text-gray-500 mt-1 truncate'>
            {restaurant.location} <span className='mx-1'>•</span>{' '}
            {restaurant.distance}
          </p>
        </div>
      </Card>
    </Link>
  );
}
