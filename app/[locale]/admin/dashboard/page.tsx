'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { mockRestaurants } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import { StatsCard } from '@/components/StatsCard';
import { QRDisplay } from '@/components/QRDisplay';
import { TipsHistoryModal } from '@/components/TipsHistoryAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CreateWorkerModal } from '@/components/CreateWorkerModal';
import { useTranslations } from 'next-intl';
import { 

  DollarSign, 
  Users,
  Store,
  TrendingUp,
  Plus,
  Edit,
  QrCode,
  MoreVertical,
  Eye,
  Trash2
} from 'lucide-react';
import { adminGetTips , adminGetWaiters , adminEditWaiter, adminCreateWaiter , adminResetWaiterBalances,adminResetWaiterBalance } from '@/services/api/user';
import toast from 'react-hot-toast';
import { EditWorkerModal } from '@/components/EditWorkerModal';
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'workers' | 'qr-codes'>('overview');
  const [mockTips, setMockTips] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingWorker, setEditingWorker] = useState<any | null>(null);
  const [isCreatingWorker, setIsCreatingWorker] = useState(false);
  const [creatingWorkerData, setCreatingWorkerData] = useState({});
  const [showTipsHistory, setShowTipsHistory] = useState(false);
  interface UserData {
    first_name: string;
    last_name: string;
  }
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const t = useTranslations('Admin');
  // Calculate totals
  const totalWorkers = workers.length;
  const totalRestaurants = mockRestaurants.length;
  
  const totalTips = mockTips.reduce((sum, tip) => sum + tip.net, 0);
  const averageTip = totalTips / mockTips.length;


  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {
      const user = localStorage.getItem('user_data');
      const tipsResponse = await adminGetTips();
      const workersResponse = await adminGetWaiters();
      if (workersResponse.data && Array.isArray(workersResponse.data)) {
        setWorkers(workersResponse.data);
      } else {
        console.error('Invalid workers data format');
      }
      if (Array.isArray(tipsResponse.data)) {
        setMockTips(tipsResponse.data as any[]);
      } else {
        console.error('Invalid tips data format');
      }
    
      if (user) {
        setUserData(JSON.parse(user));
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const resetWorkerBalances = async () => {
    try {
      const response = await adminResetWaiterBalances();
      if (response.success) {
        setWorkers((prevWorkers) =>
          prevWorkers.map((worker) => ({ ...worker, balance: 0 }))
        );
        toast.success(t("All worker balances have been reset."));
      } else {
        toast.error(t("Failed to reset worker balances. Please try again."));
      }
    } catch (error) {
      console.error('Error resetting worker balances:', error);
      toast.error(t("An error occurred while resetting worker balances."));
    }
  };

  const resetWorkerBalance = async (workerId: number) => {
    try {
      const response = await adminResetWaiterBalance(workerId);
      if (response.success) {
        setWorkers((prevWorkers) =>
          prevWorkers.map((worker) =>
            worker.id === workerId ? { ...worker, balance: 0 } : worker
          )
        );
        toast.success(t("Worker balance has been reset."));
      } else {
        toast.error('Failed to reset worker balance. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting worker balance:', error);
      toast.error('An error occurred while resetting worker balance.');
    }
  };

  const handleSaveWorker = (updatedWorker: any) => async () => {
    const updatedworker = await adminEditWaiter(updatedWorker);
    console.log('Updated Worker:', updatedworker);
    if (updatedworker.success) {
      setWorkers((prevWorkers) =>
        prevWorkers.map((worker) =>
          worker.id === updatedWorker.id ? { ...worker, ...updatedWorker } : worker
        )
      );
      toast.success(t("Worker updated successfully"));
    }
    setShowEditModal(false);
    setEditingWorker(null);

  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingWorker(null);
  };
  

  const TabButton = ({ tab, label, icon: Icon }: { tab: typeof activeTab, label: string, icon: any }) => (
    <Button
      variant={activeTab === tab ? 'default' : 'outline'}
      onClick={() => setActiveTab(tab)}
      className={activeTab === tab ? 'bg-red-600 hover:bg-red-700' : 'border-red-200 hover:bg-red-50'}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );

  return (
    <>
    {isLoading && <LoadingScreen />}
    <Navbar userType='admin' t={t}/>
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
    
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("Hello")},  {userData?.first_name} {userData?.last_name}!</h1>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
       
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tips"
            value={`$${totalTips.toFixed(2)}`}
            icon={DollarSign}
            
            className="border-2 border-red-100 bg-red-50/50"
          />
          <StatsCard
            title="Active Workers"
            value={totalWorkers}
            icon={Users}
            change={`${workers.filter(w => w.isActive).length} active`}
            className="border-2 border-blue-100 bg-blue-50/50"
          />
         
          <StatsCard
            title="Avg Tip"
            value={`$${averageTip.toFixed(2)}`}
            icon={TrendingUp}
            change={`${mockTips.length} total tips`}
            className="border-2 border-orange-100 bg-orange-50/50"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton tab="overview" label="Overview" icon={TrendingUp} />
  
          <TabButton tab="workers" label="Workers" icon={Users} />
       
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="border-2 border-red-100">
              <CardHeader>
                <CardTitle>{t("Recent Tips")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTips.slice(0, 5).map((tip) => (
                    <div key={tip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">${tip.net.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">To {tip.waiter}</p>
                      </div>
                      <div className="text-right">
                       
                        <p className="text-xs text-gray-500 mt-1">
                        {new Date(tip.created_at).toLocaleDateString()}  {new Date(tip.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  onClick={() => setShowTipsHistory(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t("View All Tips")}
                </Button>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="border-2 border-red-100">
              <CardHeader>
                <CardTitle>{t("Top Performers")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workers.slice(0, 3).map((worker, index) => (
                    <div key={worker.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="relative w-10 h-10">
                          <Image
                            src={worker.image}
                            alt={worker.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{worker.name}</p>
                        <p className="text-sm text-gray-600">{worker.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          ${worker.last_week_tips.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">{t("this week")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

       

        {activeTab === 'workers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{t("Workers")}</h2>
              <Button className="bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600" onClick={() => setIsCreatingWorker(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("Add Worker")}
              </Button>
            </div>
            <div className="flex justify-end">
              <Button 
                className="bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600"
                onClick={() => {
                  resetWorkerBalances();
                  workers.forEach(worker => worker.balance = 0);

                }}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                {t("Reset Balances")}
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <Card key={worker.id} className="border-2 border-red-100">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="relative w-20 h-20 mx-auto mb-3">
                        <Image
                          src={worker.image}
                          alt={worker.name}
                          fill
                          className="rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${worker.isActive ? 'bg-red-500' : 'bg-gray-400'} rounded-full border-2 border-white`}></div>
                      </div>
                      <h3 className="font-bold text-gray-900">{worker.name}</h3>
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-200 mt-1">
                        {worker.role}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>{worker.email}</p>
                      <p>{worker.phone}</p>
                      <p>{t("Worker Balance")}: {worker.balance}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                        setEditingWorker(worker);
                        setShowEditModal(true);
                      }}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => {
                          resetWorkerBalance(worker.id);
                          setWorkers((prevWorkers) =>
                            prevWorkers.map((w) =>
                              w.id === worker.id ? { ...w, balance: 0 } : w
                            )
                          );
                        
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        {t("Reset Balance")}
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

<EditWorkerModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        worker={editingWorker}
        onSave={handleSaveWorker}
        t={t}
      />

        <CreateWorkerModal
          isOpen={isCreatingWorker}
          onClose={() => setIsCreatingWorker(false)}
          t={t}
          onSave={(newWorker) => async () => {
            setWorkers((prevWorkers) => [...prevWorkers, newWorker]);
            const createdWorker = await adminCreateWaiter(newWorker);
            if (createdWorker.success) {
                toast.success(t('Worker created successfully'));
                setIsCreatingWorker(false);

              }

            
          }}
        />
        <TipsHistoryModal
          isOpen={showTipsHistory} // Replace with actual state to control modal visibility
          onClose={() => {
            setShowTipsHistory(false);
          }} // Replace with actual close handler
          tips={mockTips}
          t={t}
          
        />

       
    
      </div>
    </div>
    </>
  );
}