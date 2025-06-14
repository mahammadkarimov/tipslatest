// API configuration
export const API_BASE_URL = 'https://api.innomatch.xyz/tips';

export const API_ENDPOINTS = {
  TIPS: `${API_BASE_URL}/`,
} as const;

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
};

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to get headers with authentication
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};