import api from './axios';
import { CategorySlug, FilterParams } from '@/types/resto';

interface FetchRestaurantsParams {
  category: CategorySlug;
  filters: FilterParams;
}

export const fetchRestaurants = async ({
  category,
  filters,
}: FetchRestaurantsParams) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
  );

  switch (category) {
    case 'nearby':
      const nearbyRange = cleanFilters.range ? String(cleanFilters.range) : '1';
      return api.get('/api/resto/nearby', {
        params: {
          range: nearbyRange,
          lat: -6.2,
          lng: 106.816666,
        },
      });

    case 'best-seller':
      return api.get('/api/resto/best-seller');

    case 'all-restaurant':
      return api.get('/api/resto', { params: cleanFilters });

    case 'discount':
    case 'delivery':
    case 'lunch':
    default:
      return api.get('/api/resto', {
        params: { ...cleanFilters, category },
      });
  }
};

// API function for the Restaurant Detail Page
export const getRestaurantDetail = async (id: string) => {
  // You can add limitMenu, limitReview as query params if needed
  const response = await api.get(`/api/resto/${id}`, {
    params: {
      limitMenu: 20,
      limitReview: 10,
    },
  });
  return response.data.data;
};

// API function for the Restaurant Review Page
export const getRestaurantReviews = async (restaurantId: string) => {
  // According to your Swagger docs: GET /api/review/restaurant/{restaurantId}
  const response = await api.get(`/api/review/restaurant/${restaurantId}`);
  return response.data.data;
};
