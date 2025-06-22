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
import WorkerSearch from '@/components/WorkerSearch';
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
import { superAdminGetTips , superAdminGetWaiters , superAdminEditWaiter, superAdminCreateWaiter , superAdminResetWaiterBalances,superAdminResetWaiterBalance, superAdminExportTips, superAdminExportWaiters , superAdminRestaurants

 } from '@/services/api/user';
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
  const [filteredTips, setFilteredTips] = useState<any[]>([]);
  const [creatingWorkerData, setCreatingWorkerData] = useState({});
  const [showTipsHistory, setShowTipsHistory] = useState(false);
  const [filteredWorkers, setFilteredWorkers] = useState<any[]>([]);
  const [restaurantFilteredWorkers, setRestaurantFilteredWorkers] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('all');
  const [restaurantList, setRestaurantList] = useState<any[]>([]);
  const [tipslastWeek, setTipsLastWeek] = useState<number>(0);
  const [tipslastMonth, setTipsLastMonth] = useState<number>(0);
  const [totalTipsLastYear, setTotalTipsLastYear] = useState<number>(0);
  interface UserData {
    first_name: string;
    last_name: string;
  }
  
  const [userData, setUserData] = useState<UserData | null>(null);


  const calculateTipsDuration = (tips: any[],duration:number) => {
    const now = new Date();
    const lastDuration = new Date(now);
    lastDuration.setDate(now.getDate() - duration);
    return tips.filter(tip => new Date(tip.created_at) >= lastDuration)
      .reduce((sum, tip) => sum + tip.net, 0);
  }


  const t = useTranslations('Admin');
  // Calculate totals
  const totalWorkers = filteredWorkers.length;
  const totalRestaurants = mockRestaurants.length;
  
  const totalTips = filteredTips.reduce((sum, tip) => sum + tip.net, 0);
  const tipsLastWeek = calculateTipsDuration(filteredTips, 7);
  const tipsLastMonth = calculateTipsDuration(filteredTips, 30);
  const tipsLastYear = calculateTipsDuration(filteredTips, 365);
  const tipsToday = calculateTipsDuration(filteredTips, 1);
  const averageTip = totalTips / filteredTips.length;


  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {
      const user = localStorage.getItem('user_data');
      const tipsResponse = await superAdminGetTips();
      const workersResponse = await superAdminGetWaiters();
      if (workersResponse.data && Array.isArray(workersResponse.data)) {
        setWorkers(workersResponse.data);
        setFilteredWorkers(workersResponse.data); // Initialize filtered workers with all workers
        setRestaurantFilteredWorkers(workersResponse.data); // Initialize restaurant filtered workers with all workers
      } else {
        console.error('Invalid workers data format');
      }
      if (Array.isArray(tipsResponse.data)) {
        setMockTips(tipsResponse.data as any[]);
        setFilteredTips(tipsResponse.data as any[]);
        

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

  useEffect(() => {
    const fetchRestaurants = async () => {
        try {
            const response = await superAdminRestaurants();
            if (response.success && Array.isArray(response.data)) {
            setRestaurantList(response.data);
            } else {
            console.error('Invalid restaurant data format');
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
        }
    fetchRestaurants();
  }, []);

  const resetWorkerBalances = async () => {
    try {
      const response = await superAdminResetWaiterBalances();
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
      const response = await superAdminResetWaiterBalance(workerId);
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
    const updatedworker = await superAdminEditWaiter(updatedWorker);
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

        <div className="mb-6">
            <label htmlFor="restaurantFilter" className="block text-sm font-medium text-gray-700">
                {t("Filter by Restaurant")}
            </label>
            <select
                id="restaurantFilter"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                onChange={(e) => {
                    const selectedRestaurant = e.target.value;
                    if (selectedRestaurant === "all") {
                        setRestaurantFilteredWorkers(workers);
                        setFilteredWorkers(workers);
                        setSelectedRestaurant("all");
                        setFilteredTips(mockTips);
                    } else {
                        const filtered = workers.filter((worker) => worker.restaurant_id == selectedRestaurant);
                        setRestaurantFilteredWorkers(filtered);
                        setFilteredWorkers(filtered);
                        setSelectedRestaurant(selectedRestaurant);
                        setFilteredTips(mockTips.filter(tip => tip.restaurant == selectedRestaurant));

                    }
                }}
            >
                <option value="all">{t("All Restaurants")}</option>
                {restaurantList.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.restaurant_name}
                    </option>
                ))}
            </select>
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
                title="Tips Today"
                value={`$${tipsToday.toFixed(2)}`}
                icon={TrendingUp}
                change={`${filteredTips.filter(tip => new Date(tip.created_at) >= new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)).length} tips`}
                className="border-2 border-green-100 bg-green-50/50"
            />
            <StatsCard
                title="Tips Last Week"
                value={`$${tipsLastWeek.toFixed(2)}`}
                icon={TrendingUp}
                change={`${filteredTips.filter(tip => new Date(tip.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} tips`}
                className="border-2 border-green-100 bg-green-50/50"
            />
            
             <StatsCard
                title="Tips Last Month"
                value={`$${tipsLastMonth.toFixed(2)}`}
                icon={TrendingUp}
                change={`${filteredTips.filter(tip => new Date(tip.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} tips`}
                className="border-2 border-green-100 bg-green-50/50"
            />
            <StatsCard
            title="Tips Last Year"
            value={`$${tipsLastYear.toFixed(2)}`}
            icon={TrendingUp}
            change={`${filteredTips.filter(tip => new Date(tip.created_at) >= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)).length} tips`}
            className="border-2 border-green-100 bg-green-50/50"
            />
          <StatsCard
            title="Active Workers"
            value={totalWorkers}
            icon={Users}
            change={`${filteredWorkers.filter(w => w.isActive).length} active`}
            className="border-2 border-blue-100 bg-blue-50/50"
          />
         
          <StatsCard
            title="Avg Tip"
            value={`$${averageTip.toFixed(2)}`}
            icon={TrendingUp}
            change={`${filteredTips.length} total tips`}
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
            <>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="border-2 border-red-100">
              <CardHeader>
                <CardTitle>{t("Recent Tips")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTips.slice(0, 5).map((tip) => (
                    <div key={tip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">${tip.net.toFixed(2)}</p>
                        <p className="font-semibold text-gray-600 italic">{tip.description}</p>
                        <p className="text-sm text-gray-600">{tip.waiter}</p>
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
                  {filteredWorkers.slice(0, 3).map((worker, index) => (
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
           <div className="space-y-6">
           <Card className="border-2 border-red-100">
             <CardHeader>
               <CardTitle className="text-lg">{t("Quick Actions")}</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
               <Button variant="outline" className="w-full justify-start" onClick={async() => {
                    
                    const selectedRestaurant = document.getElementById('restaurantFilter') as HTMLSelectElement;
                    const restaurantId = selectedRestaurant.value;
                   const response = await superAdminExportTips(restaurantId);
                   if (response.success) {
                       const fileUrl = response.data.file_url;
                       if (fileUrl) {
                           const a = document.createElement('a');
                           a.style.display = 'none';
                           a.href = fileUrl;
                     
                           document.body.appendChild(a);
                           a.click();
                           document.body.removeChild(a);
                           toast.success(t("Tips exported successfully"));
                       } else {
                           toast.error(t("Failed to export tips. No file URL provided."));
                       }
                   } else {
                       toast.error(t("Failed to export tips. Please try again."));
                   }
               }}>
                
                 {t("Export Tips")}
               </Button>
               <Button variant="outline" className="w-full justify-start" onClick={async() => {
                   const selectedRestaurant = document.getElementById('restaurantFilter') as HTMLSelectElement;
                   const restaurantId = selectedRestaurant.value;
                   const response = await superAdminExportWaiters(restaurantId);
                   if (response.success) {
                       const fileUrl = response.data.file_url;
                       if (fileUrl) {
                           const a = document.createElement('a');
                           a.style.display = 'none';
                           a.href = fileUrl;
                     
                           document.body.appendChild(a);
                           a.click();
                           document.body.removeChild(a);
                           toast.success(t("Workers exported successfully"));
                       } else {
                           toast.error(t("Failed to export tips. No file URL provided."));
                       }
                   } else {
                       toast.error(t("Failed to export tips. Please try again."));
                   }
               }}>
                
                 {t("Export Waiters")}
               </Button>
              {/* <MyCards />
              <WithdrawModal cards={cards} balance={waiterData?.balance || 0}/>*/}
               
             </CardContent>
           </Card>

        
         </div>
         </>
        )}

       

        {activeTab === 'workers' && (

            
            
          <div className="space-y-6">
            <div className="mb-6">
            <input
  type="text"
  placeholder={t("Search Workers")}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
  onChange={(e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = restaurantFilteredWorkers.filter((worker) =>
      worker.name.toLowerCase().includes(searchTerm)||
        worker.waiter_id.toString().toLowerCase().includes(searchTerm) ||
        worker.phone.toLowerCase().includes(searchTerm) ||
        worker.role.toLowerCase().includes(searchTerm)
    );
    setFilteredWorkers(filtered);
  }}
/>

              
                 
                  
            </div>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{t("Workers")}</h2>
              {
                selectedRestaurant != 'all' && 
                <Button className="bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600" onClick={() => setIsCreatingWorker(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("Add Worker")}
              </Button>
              }
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
              {filteredWorkers.map((worker) => (
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
                      <p>{worker.waiter_id}</p>
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
       
       {
        selectedRestaurant != 'all' && 
            <CreateWorkerModal
            isOpen={isCreatingWorker}
            onClose={() => setIsCreatingWorker(false)}
            t={t}       
            onSave={(newWorker) => async () => {
              setWorkers((prevWorkers) => [...prevWorkers, newWorker]);
              const createdWorker = await superAdminCreateWaiter(newWorker);
              if (createdWorker.success) {
                  toast.success(t('Worker created successfully'));
                  setIsCreatingWorker(false);
  
                }
  
              
            }}
            restaurantId={selectedRestaurant}
          />
       }
        <TipsHistoryModal
          isOpen={showTipsHistory} // Replace with actual state to control modal visibility
          onClose={() => {
            setShowTipsHistory(false);
          }} // Replace with actual close handler
          tips={filteredTips}
          t={t}
          
        />

       
    
      </div>
    </div>
    </>
  );
}