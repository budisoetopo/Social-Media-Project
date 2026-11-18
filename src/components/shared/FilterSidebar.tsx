'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { CategorySlug } from '@/types/resto';

export function FilterSidebar({ category }: { category: CategorySlug }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentRange =
    searchParams.get('range') || (category === 'nearby' ? '1' : '');

  return (
    <div className='w-full space-y-8'>
      {/* Distance Filter */}
      <div>
        <Label className='text-sm font-bold text-gray-900 mb-3 block'>
          Distance
        </Label>
        <RadioGroup
          className='space-y-3'
          value={currentRange}
          onValueChange={(val) => updateFilter('range', val)}
        >
          {['1'].map((km) => (
            <div key={km} className='flex items-center space-x-3'>
              <RadioGroupItem
                value='1'
                id='range-nearby'
                className='border-gray-400 text-[#DA2E28]'
              />
              <Label
                htmlFor='range-nearby'
                className='text-sm text-gray-700 font-normal cursor-pointer'
              >
                Nearby
              </Label>
            </div>
          ))}

          {['1', '3', '5'].map((km) => (
            <div key={km} className='flex items-center space-x-3'>
              <RadioGroupItem
                value={km}
                id={`range-${km}`}
                className='border-gray-400 text-[#DA2E28]'
              />
              <Label
                htmlFor={`range-${km}`}
                className='text-sm text-gray-700 font-normal cursor-pointer'
              >
                Within {km} km
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Price Filter */}
      <div>
        <Label className='text-sm font-bold text-gray-900 mb-3 block'>
          Price
        </Label>
        <div className='flex flex-col gap-3'>
          <div className='relative'>
            <span className='absolute left-3 top-2.5 text-gray-500 font-medium text-sm bg-gray-200 px-1.5 rounded'>
              Rp
            </span>
            <Input
              placeholder='Minimum Price'
              type='number'
              className='pl-12 bg-white border-gray-300 text-sm focus-visible:ring-1 focus-visible:ring-red-500 rounded-xl'
              onChange={(e) => updateFilter('priceMin', e.target.value)}
              defaultValue={searchParams.get('priceMin') || ''}
            />
          </div>
          <div className='relative'>
            <span className='absolute left-3 top-2.5 text-gray-500 font-medium text-sm bg-gray-200 px-1.5 rounded'>
              Rp
            </span>
            <Input
              placeholder='Maximum Price'
              type='number'
              className='pl-12 bg-white border-gray-300 text-sm focus-visible:ring-1 focus-visible:ring-red-500 rounded-xl'
              onChange={(e) => updateFilter('priceMax', e.target.value)}
              defaultValue={searchParams.get('priceMax') || ''}
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <Label className='text-sm font-bold text-gray-900 mb-3 block'>
          Rating
        </Label>
        <RadioGroup
          className='space-y-3'
          value={searchParams.get('rating') || ''}
          onValueChange={(val) => updateFilter('rating', val)}
        >
          {['5', '4', '3', '2', '1'].map((star) => (
            <div key={star} className='flex items-center space-x-3'>
              <RadioGroupItem
                value={star}
                id={`rating-${star}`}
                className='border-gray-400 text-[#DA2E28]'
              />
              <Label
                htmlFor={`rating-${star}`}
                className='flex items-center text-sm text-gray-700 font-normal cursor-pointer'
              >
                <span className='text-orange-400 mr-1.5 text-lg'>★</span> {star}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
