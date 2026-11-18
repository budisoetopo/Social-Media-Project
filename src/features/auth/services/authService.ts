import api from '@/lib/api/axios';

import type {
  LoginRequest,
  LoginResponse,
  LoginSuccessResponse,
} from '@/types/auth';

// Login Function
export async function loginUser(values: { email: string; password: string }) {
  const { data } = await api.post('/auth/login', {
    email: values.email,
    password: values.password,
  });
  return data;
}

// Register Function
export const registerUser = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};
