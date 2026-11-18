'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';
import { useAuthStore } from '@/store/authStore';

type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export const useRegister = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await api.post('/api/auth/register', data);
      return response.data;
    },
    onSuccess: (responseData) => {
      console.log('Register Success Response:', responseData);

      const user = responseData.data?.user || responseData.user;
      const token = responseData.data?.token || responseData.token;

      if (token && user) {
        // If backend returns a token, log them in instantly
        setAuth(user, token);
        router.push('/');
      } else {
        // If no token, redirect to login page so they can log in manually
        router.push('/login');
      }
    },
    onError: (error: any) => {
      console.error('Register failed:', error?.response?.data);
    },
  });
};
