import axios from 'axios';

import type { LoginErrorResponse } from '@/types/auth';

export function getLoginError(error: unknown): string {
  if (error instanceof Error && !axios.isAxiosError(error)) {
    return error.message;
  }

  if (axios.isAxiosError<LoginErrorResponse>(error)) {
    const response = error.response?.data;

    if (response) {
      if (response.errors?.length > 0) {
        return response.errors.join(', ');
      }

      if (response.message) {
        return response.message;
      }
    }
  }

  return 'Unable to login. Please try again.';
}
