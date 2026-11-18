'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/auth';
import { updateUserDatabase } from '@/lib/auth';

type UpdateProfileData = Partial<User> & { password?: string };

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // ✅ THIS MUST SAVE THE TOKEN
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

      signOut: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth' } // This tells Zustand to save to localStorage under the key 'auth'
  )
);
