'use client';

import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { useAuthStore } from '@/store/authStore';

type LoginInput = {
  email: string;
  password: string;
};

// Normalize user shape
function normalizeUser(raw: any) {
  if (!raw) return raw;
  return {
    ...raw,
    avatar:
      raw.avatar ?? raw.avatarUrl ?? raw.profilePicture ?? raw.image ?? null,
    bio: raw.bio ?? '',
    phone: raw.phone ?? '',
  };
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: async (responseData) => {
      console.log('FULL LOGIN RESPONSE:', responseData);

      const initialUser = normalizeUser(
        responseData.data?.user ?? responseData.user
      );
      const token = responseData.data?.token ?? responseData.token;

      console.log('Login user (raw):', initialUser);
      console.log('Login token:', token);

      if (!token) {
        console.error('❌ CRITICAL: No token found in the response!');
        throw new Error('No token returned from backend');
      }

      let fullUser = initialUser;
      try {
        const me = await api.get('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetched = normalizeUser(
          me.data?.data?.user ?? me.data?.user ?? me.data?.data
        );
        if (fetched) {
          // merge, prefer fresh server values but keep anything login returned
          fullUser = { ...initialUser, ...fetched };
          console.log('Hydrated user from /api/me:', fullUser);
        }
      } catch (e) {
        console.warn(
          '⚠️ Could not hydrate from /api/me — falling back to login payload.',
          e
        );
      }

      setAuth(fullUser, token);

      console.log('Zustand state after setAuth:', useAuthStore.getState());
    },
  });
}
