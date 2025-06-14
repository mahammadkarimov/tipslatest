'use client';

import { useState, useCallback } from 'react';
import { login, LoginCredentials, LoginResponse } from '@/services/api/auth';
import { useRouter, useParams , usePathname } from 'next/navigation';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const app = pathname.split('/')[2] || 'admin';
  const locale = params.locale || 'en'; // Default to 'en' if locale is not provided

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(credentials);

      if (!response.success || !response.data) {
        setError(response.error || 'Login failed');
        return false;
      }
      if(app=== 'worker' && response.data.user_type !== 'tipswaiter') {
        setError('You are not authorized to access this portal');
        return false;
      }
      if(app === 'admin' && response.data.user_type !== 'tipsadmin') {
            setError('You are not authorized to access this portal');
            return false;
        }
      router.replace(`/${app}/dashboard`);
      return true;
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [router, app]);


  const getUserData = useCallback(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }, []);

  const getAccessToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }, []);

  const getRefreshToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      router.replace(`/${locale}/${app}/login`);
    }
  }, [router, app]);

  return {
    isLoading,
    error,
    login: handleLogin,
    getUserData,
    getAccessToken,
    getRefreshToken,
    logout,
    isAuthenticated: !!getAccessToken(),
  };
}