import api from './axios';

export interface CheckoutPayload {
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
  restaurants: {
    restaurantId: string;
    items: { menuId: string; quantity: number }[];
  }[];
}

export const checkoutOrder = async (data: any) => {
  const response = await api.post('/api/order/checkout', data);
  return response.data;
};

export const getMyOrders = async (status?: string, page: number = 1) => {
  const params: any = { page };

  if (typeof status === 'string') {
    params.status = status;
  }

  const response = await api.get('/api/order/my-order', { params });
  console.log('RAW MY ORDERS API RESPONSE:', response.data);

  const data = response.data?.data;

  if (data?.orders) {
    console.log('FIRST ORDER SAMPLE:', data.orders[0]);
    return data.orders;
  }

  return [];
};

export const createReview = async (data: {
  transactionId: string;
  restaurantId: string;
  star: number;
  comment: string;
}) => {
  const response = await api.post('/api/review', data);
  return response.data;
};

export const getMyReviews = async () => {
  const response = await api.get('/api/review/my-reviews');
  // Returns an array of reviews
  return response.data?.data?.reviews || [];
};

export const updateReview = async (
  reviewId: number | string,
  data: { star: number; comment: string }
) => {
  // Adjust the URL to match your Swagger docs exactly
  const response = await api.put(`/api/review/${reviewId}`, data);
  return response.data;
};
