'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreditCard, Home, Settings, Users, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import LanguageChanger from './LanguageChanger';

import { cn } from '@/lib/utils';

interface NavbarProps {
  userType?: 'worker' | 'admin' | 'customer';
  t?: any; // Translation function, optional
}

export function Navbar({ userType , t }: NavbarProps) {
  const pathname = usePathname();
  const {logout} = useAuth();

  if (userType === 'worker') {
    return (
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/worker/dashboard" className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-red-600" />
            <span className="font-bold text-xl text-gray-900">Tips BYQR</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/worker/dashboard">
              <Button 
                variant={pathname === '/worker/dashboard' ? 'default' : 'ghost'}
                size="sm"
                className={cn(pathname === '/worker/dashboard' && 'bg-red-600 hover:bg-red-700')}
              >
                <Home className="w-4 h-4 mr-2" />
                {t("Dashboard")}
              </Button>
            </Link>
            
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("Logout")}
              </Button>

            <LanguageChanger />
            
          </div>
        </div>
      </nav>
    );
  }

  if (userType === 'admin') {
    return (
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-red-600" />
            <span className="font-bold text-xl text-gray-900">Tips BYQR</span>
          </Link>
          
          <div className="flex items-center space-x-4">
          

              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("Logout")}
              </Button>
              <LanguageChanger />
            
          </div>
        </div>
      </nav>
    );
  }

  // Customer/default navbar
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-6 h-6 text-red-600" />
          <span className="font-bold text-xl text-gray-900">Tips BYQR</span>
          
        </div>
      
        
      </div>
      
    </nav>
  );
}