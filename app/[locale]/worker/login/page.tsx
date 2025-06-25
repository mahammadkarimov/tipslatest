'use client';

import { useState } from 'react';
import { useRouter , usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from "@/hooks/use-auth";
import { CreditCard, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageChanger from '@/components/LanguageChanger';
export default function WorkerLogin() {
  const t = useTranslations('Worker');  
  const router = useRouter();
  const [waiter_id, setwaiter_id] = useState('');
  const pathname = usePathname();
  const app = pathname.split('/')[2] || 'worker';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error: authError, isAuthenticated } = useAuth();
  
  const locale = pathname.split('/')[1];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login({
        waiter_id,
        password,
      });

      if (success) {
        router.replace(`/${locale}/${app}/dashboard`);
      } else {
        setError(authError || 'An unexpected error occurred. Please try again later.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-500 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-2 border-red-100">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CreditCard className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Tips BYQR
            </span>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <CardTitle className="text-2xl font-bold text-gray-900">{t("Worker Portal")}</CardTitle>
          <p className="text-gray-600">{t("Sign in to access your tip dashboard")}</p>
          <LanguageChanger />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("Waiter ID")}</label>
              <div className="relative">
               
                <Input
                  type="text"
                  placeholder="123456"
                  value={waiter_id}
                  onChange={(e) => setwaiter_id(e.target.value)}

                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("Password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-5000 hover:from-red-600 hover:to-red-6000"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("Signing in...")}</span>
                </div>
              ) : (
                t("Sign In")
              )}
            </Button>
          </form>

       

         
        </CardContent>
      </Card>
    </div>
  );
}