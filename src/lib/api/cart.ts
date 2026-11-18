import api from './axios';

export const getCart = async () => {
  const response = await api.get('/api/cart');
  const itemsArray =
    response.data?.data?.items || response.data?.data?.cart?.items || [];

  return itemsArray; // Return just the array, not the whole object
};

export const updateCartItem = async (id: string, quantity: number) => {
  const response = await api.put(`/api/cart/${id}`, { quantity });
  return response.data;
};

export const removeCartItem = async (id: string) => {
  const response = await api.delete(`/api/cart/${id}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/api/cart');
  return response.data;
};
