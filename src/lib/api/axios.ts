import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://be-restaurant-production.up.railway.app',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  let token = null;

  if (typeof window !== 'undefined') {
    // 1. Log the whole Zustand state to see exactly what it's called!
    const state = useAuthStore.getState();
    console.log('🔍 Current Auth Store State:', state);

    // 2. Try to grab it from Zustand (Try token, accessToken, etc)
    token = state.token || state.accessToken || state.user?.token;

    // 3. Fallback to LocalStorage
    if (!token) token = localStorage.getItem('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`✅ Sending request to ${config.url} WITH token.`);
  } else {
    console.log(`❌ Sending request to ${config.url} WITHOUT token!`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized! Token expired or invalid.');
    }
    return Promise.reject(error);
  }
);

export default api;
