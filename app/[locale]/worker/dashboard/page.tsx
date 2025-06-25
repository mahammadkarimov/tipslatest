'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { mockWorkers, getTipsByWorker, calculateTipStats } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import {TipsHistoryModal} from '@/components/TipsHistoryModal';
import { StatsCard } from '@/components/StatsCard';
import { QRDisplay } from '@/components/QRDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {LoadingScreen} from '@/components/LoadingScreen';
import   {getWaiterData , getWaiterTips , getBankCards} from '@/services/api/user';
import MyCards from '@/components/MyCards';
import WithdrawModal from '@/components/WithdrawMoney';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Clock,
  CreditCard,
  Share2,
  Edit,
  Eye
} from 'lucide-react';
import { workerData } from 'node:worker_threads';
import toast from 'react-hot-toast';
import { set } from 'date-fns';
import { useRouter } from 'next/navigation';

interface UserData {
  username: string;
  first_name:string;
  last_name: string;
  profile_photo: string;
  user_type: string;
  email: string;
  role:string;
}

export default function WorkerDashboard() {
  // Using first worker as demo - in real app this would come from auth
  const worker = mockWorkers[0];
  const t = useTranslations('Worker');
  const router = useRouter();
  const [userData,setUserData] = useState<UserData | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    daily: number;
    weekly: number;
    monthly: number;
    totalTips: number;
    averageTip: number;
    tipCount: number;
  } | null>(null);
  const [showQR, setShowQR] = useState(false);

  const [showTipsModal, setShowTipsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [waiterData, setWaiterData] = useState<any>(null);
  const [tips, setTips] = useState<any[]>([]);


  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem('user_data');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.replace('/worker/login');
      toast.error('Please login to continue');
    }
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await getBankCards();
        if (response.success) {
          setCards(response.data);
        } else {
          console.error('Failed to fetch cards:', response.error);
        }
      }
      catch (error) {
        console.error('Error fetching cards:', error);
        toast.error('Failed to fetch cards. Please try again later.');
      }
    };
    fetchCards();
  }, []);

        

  useEffect(() => {
    const fetchWaiterData = async () => {
      try {
        const data = await getWaiterData();
        const tipsData = await getWaiterTips();
        setWaiterData(data);
        setTips(tipsData);
        setStats(calculateTipStats(tipsData));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching waiter data:', error);
        router.replace('/worker/login');
        toast.error('Please login to continue');
      }
    };
    fetchWaiterData();
  }, []);


  const recentTips = tips.slice(0, 5);

  const formatDate = (date: string | Date) => {
    const d = new Date(date); // Always convert to Date object
    return d.toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'apple_pay':
        return '🍎';
      case 'google_pay':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <>
       {loading && <LoadingScreen />}
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      
      <Navbar userType="worker" t={t} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <Image
                  src={userData?.profile_photo || worker.photo}
                  alt={userData?.first_name || worker.name}
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("Welcome back")}, {userData?.first_name}!
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
                    {waiterData?.role || worker.role}
                  </Badge>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">{waiterData?.restaurant}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowQR(!showQR)}
                className="border-red-200 hover:bg-red-50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t("Share QR Code")}
              </Button>
           
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="mb-8">
            <QRDisplay
              title="Your Personal QR Code"
              subtitle="Share this with customers for direct tips"
              qrCode={'https://tips.byqr.az/tip/'+waiterData.tip_slug}
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
            title="Balance"
            value={`₼${waiterData?.balance?.toFixed(2) || '0.00'}`}
          
            icon={CreditCard}
            
            className="border-2 border-blue-100 bg-blue-50/50"
          />
          <StatsCard
            title="Today's Tips"
            value={`₼${stats?.daily?.toFixed(2) || '0.00'}`}
            icon={DollarSign}
           
            className="border-2 border-red-100 bg-red-50/50"
          />
          <StatsCard
            title="This Week"
            value={`₼${stats?.weekly?.toFixed(2) || '0.00'}`}
            icon={TrendingUp}
            
            className="border-2 border-blue-100 bg-blue-50/50"
          />
          <StatsCard
            title="This Month"
             value={`₼${stats?.monthly?.toFixed(2) || '0.00'}`}
            icon={Calendar}
            
            className="border-2 border-purple-100 bg-purple-50/50"
          />
          <StatsCard
            title="Average Tip"
            value={`₼${stats?.averageTip?.toFixed(2) || '0.00'}`}
            icon={CreditCard}
            change={`${stats?.tipCount || 0} tips total`}
            className="border-2 border-orange-100 bg-orange-50/50"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Tips */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <span>{t("Recent Tips")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentTips.length > 0 ? (
                  <div className="space-y-4">
                    {recentTips.map((tip) => (
                      <div key={tip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            <span className="font-semibold text-gray-900">
                            ₼{parseFloat(tip.net).toFixed(2)}
                            </span>
                            
                            <span className="text-sm text-gray-600">
                              {getPaymentMethodIcon(tip.payment_method)}
                            </span>
                          </div>
                          {tip.description && (
                            <p className="text-sm text-gray-600 mt-1 italic">
                              "{tip.description}"
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {formatDate(tip.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("No tips yet")}</h3>
                    <p className="text-gray-600">{t("Tips will appear here as customers leave them")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-2 border-red-100">
              <CardHeader>
                <CardTitle className="text-lg">{t("Quick Actions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowTipsModal(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  {t("View All Tips")}
                </Button>
               <MyCards t={t} />
               <WithdrawModal cards={cards} balance={waiterData?.balance || 0} t={t}/>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="border-2 border-red-100 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-lg text-red-700">{t("Your Performance")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t("Customer Rating")}</span>
                    <span className="font-semibold text-red-700">{waiterData?.rating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t("Tips This Month")}</span>
                    <span className="font-semibold text-red-700">{stats?.tipCount || 0}</span>
                  </div>
                
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <TipsHistoryModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        tips={tips}
        t={t}
        workerName={userData?.first_name + ' ' + userData?.last_name || worker.name}
        workerPhoto={userData?.profile_photo || worker.photo}
      />
    </div>
    </>
  );
}