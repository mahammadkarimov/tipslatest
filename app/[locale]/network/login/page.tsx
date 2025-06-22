'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import {useAuth} from "@/hooks/use-auth";
import { useTranslations } from 'next-intl';
import LanguageChanger from '@/components/LanguageChanger'
import toast from 'react-hot-toast';



export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth();
  const t = useTranslations('Admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    const success = await login({
      email,
      password,
    });
    setIsLoading(false);
    if (!success) {
      toast.error('Invalid email or password. Please try again.');
      return;
    }
    // Redirect to admin dashboard on successful login
    router.push('/network/dashboard');
    
    // In a real app, validate credentials here
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-2 border-red-100">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CreditCard className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent">
              Tips BYQR
            </span>
          </div>
            
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="w-6 h-6 text-red-600" />
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Portal</CardTitle>
          </div>
          <p className="text-gray-600">{t('Manage your restaurants and staff')}</p>
          <LanguageChanger  />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="admin@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('Password')}</label>
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
              className="w-full bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('Signing in')}...</span>
                </div>
              ) : (
                t("Sign In to Admin Panel")
              )}
            </Button>
          </form>

          
        </CardContent>
      </Card>
    </div>
  );
}