import type { User } from '@/lib/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  success: true;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;
