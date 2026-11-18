import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { fetchRestaurants } from '@/lib/api/resto';
import { CategorySlug, FilterParams } from '@/types/resto';

export const useRestaurants = (category: CategorySlug) => {
  const searchParams = useSearchParams();

  const filters: FilterParams = {
    range:
      searchParams.get('range') || (category === 'nearby' ? '0.5' : undefined),
    priceMin: searchParams.get('priceMin') || undefined,
    priceMax: searchParams.get('priceMax') || undefined,
    rating: searchParams.get('rating') || undefined,
  };

  return useQuery({
    queryKey: ['restaurants', category, filters],
    queryFn: async () => {
      const response = await fetchRestaurants({ category, filters });

      console.log(`API Response for ${category}:`, response.data);

      let arrayData = [];
      if (Array.isArray(response.data)) {
        arrayData = response.data;
      } else if (Array.isArray(response.data?.data)) {
        arrayData = response.data.data;
      } else if (Array.isArray(response.data?.data?.restaurants)) {
        arrayData = response.data.data.restaurants;
      }

      // Map the data and extract a raw number for distance
      const mappedData = arrayData.map((item: any) => {
        let distanceValue = 2.4;
        if (item.distance) {
          distanceValue =
            typeof item.distance === 'number'
              ? item.distance
              : parseFloat(item.distance);
        }

        return {
          id: item.id,
          name: item.name || 'Unknown Restaurant',
          rating: item.star || 0,
          location: item.place || 'Location unknown',
          image: item.logo || '',
          distance: `${distanceValue} km`,
          distanceValue: distanceValue,
        };
      });

      // Filtering based on the Distance filter
      let finalData = mappedData;
      if (filters.range) {
        const maxDistance = parseFloat(filters.range);
        finalData = mappedData.filter(
          (resto) => resto.distanceValue <= maxDistance
        );
      }

      return finalData;
    },
    placeholderData: keepPreviousData,
  });
};
