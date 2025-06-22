'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { WorkerCard } from '@/components/WorkerCard';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, QrCode } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { restaurantDataGet } from '@/services/api/user';
import { useTranslations } from 'next-intl';
import { set } from 'date-fns';
export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantUsername = params.restaurantId as string;
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('Home');
  interface RestaurantData {
    restaurant_profile_photo: string;
    restaurant_name: string;
    address: string;
    phone: string;
    waiters?: { id: string; tip_slug: string }[];
  }

  const [restaurantData, setrestaurantData] = useState<RestaurantData | null>(null);
  const [workers, setWorkers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await restaurantDataGet(restaurantUsername);
        if (response.success) {
         setrestaurantData(response.data);
         setWorkers(response.data.waiters || []);
        }
  } catch (error) {
    if (!restaurantData) {
      console.error(error);
    }
  } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [restaurantUsername]);

  if (restaurantData && Object.keys(restaurantData).length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Restaurant Not Found')}</h1>
          <p className="text-gray-600">{t('The QR code you scanned is invalid.')}</p>
        </div>
      </div>
    );
  }

  const handleWorkerSelect = (tip_slug: string) => {
    router.push(`/tip/${tip_slug}`);
  };

  return (
    <>
    {isLoading && <LoadingScreen />}
    
    {/* Main Layout */}
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <Navbar userType="customer" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Restaurant Header */}
        <Card className="mb-8 overflow-hidden border-2 border-teal-100">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 text-white">
              <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <Image
                src={restaurantData?.restaurant_profile_photo || ''}
                alt={restaurantData?.restaurant_name || ''}
                fill
                className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{restaurantData?.restaurant_name || ''}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0 text-white/90">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{restaurantData?.address || ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{restaurantData?.phone || ''}</span>
                </div>
                </div>
              </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm border border-teal-100">
            <QrCode className="w-5 h-5 text-red-600" />
            <span className="text-gray-700 font-medium">{t('Select your server to leave a tip')}</span>
            </div>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            worker.isActive && (
              <WorkerCard
              key={worker.id}
              worker={worker}
              onSelect={() => handleWorkerSelect(worker.tip_slug)}
              t={t}
            />
            )
            
          ))}
        </div>

        {workers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('No Staff Available')}</h3>
            <p className="text-gray-600">{t('Please try again later or contact the restaurant.')}</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}