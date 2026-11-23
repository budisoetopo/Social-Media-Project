'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

type RegisterInput = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
};

export const useRegister = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await axios.post(
        'https://be-social-media-api-production.up.railway.app/api/auth/register',
        data
      );
      return response.data;
    },
    onSuccess: (responseData) => {
      console.log('Register Success Response:', responseData);

      const user = responseData.data?.user || responseData.user;
      const token = responseData.data?.token || responseData.token;

      if (token && user) {
        setAuth(user, token);
        router.push('/');
      } else {
        router.push('/login');
      }
    },
    onError: (error: any) => {
      const backendErrors = error?.response?.data?.data;
      let errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An unknown error occurred';

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        errorMessage = backendErrors[0]?.msg || errorMessage;
      }

      console.error('Register failed:', errorMessage, error?.response?.data);
    },
  });
};
