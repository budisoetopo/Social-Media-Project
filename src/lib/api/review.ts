import api from './axios';

interface CreateReviewInput {
  transactionId: string;
  restaurantId: string;
  star: number;
  comment: string;
}

export const createReview = async (data: CreateReviewInput) => {
  // According to Swagger: POST /api/review
  const response = await api.post('/api/review', data);
  return response.data;
};
