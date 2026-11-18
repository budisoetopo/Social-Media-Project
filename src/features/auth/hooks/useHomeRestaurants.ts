import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { Restaurant } from '@/types'; // Adjust path if needed based on your project

export const useHomeRestaurants = (query: string = '') => {
  return useQuery({
    // The query key includes the search query.
    // When the user searches, TanStack Query fetches automatically.
    queryKey: ['restaurants', 'home', query],
    queryFn: async () => {
      const endpoint = query ? '/api/resto/search' : '/api/resto';

      const response = await api.get(endpoint, {
        params: query ? { q: query } : {},
      });

      let arrayData = response.data?.data?.restaurants || [];

      // Frontend filter for search (as you had before)
      if (query) {
        arrayData = arrayData.filter((item: any) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Map to your interface
      return arrayData.map((item: any) => ({
        id: item.id,
        name: item.name || 'Unknown Restaurant',
        rating: item.star || 0,
        location: item.place || 'Location unknown',
        image: item.logo || '',
        distance: '2.4 km',
      })) as Restaurant[];
    },
    // Keeps previous data visible while fetching new search results
    placeholderData: keepPreviousData,
  });
};
