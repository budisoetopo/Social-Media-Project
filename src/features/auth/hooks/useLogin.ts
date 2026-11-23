'use client';

import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { useAuthStore } from '@/store/authStore';

type LoginInput = {
  email: string;
  password: string;
};

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: (responseData) => {
      console.log('FULL LOGIN RESPONSE:', responseData);
      const user = responseData.data?.user || responseData.user;
      const token =
        responseData.data?.token ||
        responseData.data?.accessToken ||
        responseData.token ||
        responseData.accessToken;

      if (!token) {
        console.error('❌ CRITICAL: No token found in the response!');
        throw new Error('No token returned from backend');
      }

      setAuth(user, token);
    },
  });
}
