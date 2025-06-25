import { Restaurant, Tip } from './types';

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest1',
    name: 'The Golden Plate',
    logo: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    address: '123 Main St, Downtown',
    phone: '(555) 123-4567',
    qrCode: 'QR_GOLDEN_PLATE_001'
  },
  {
    id: 'rest2',
    name: 'Bella Vista Café',
    logo: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    address: '456 Oak Ave, Midtown',
    phone: '(555) 987-6543',
    qrCode: 'QR_BELLA_VISTA_002'
  }
];

export const mockWorkers: any[] = [
  {
    id: 'worker1',
    name: 'Sarah Johnson',
    role: 'Head Waiter',
    rating: 4.9,
    balance: 150.00,
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
    restaurantId: 'rest1',
    email: 'sarah.j@goldenplate.com',
    phone: '(555) 111-2222',
    qrCode: 'https://tips.byqr.az/tip/Sarah-Johnson-2199129',
    isActive: true
  },
  {
    id: 'worker2',
    name: 'Marcus Chen',
    role: 'Waiter',
    rating: 4.7,
    balance: 150.00,
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
    restaurantId: 'rest1',
    email: 'marcus.c@goldenplate.com',
    phone: '(555) 333-4444',
    qrCode: 'QR_MARCUS_C_002',
    isActive: true
  },
  {
    id: 'worker3',
    name: 'Elena Rodriguez',
    role: 'Server',
    rating: 4.8,
    balance: 150.00,
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
    restaurantId: 'rest1',
    email: 'elena.r@goldenplate.com',
    phone: '(555) 555-6666',
    qrCode: 'QR_ELENA_R_003',
    isActive: true
  },
  {
    id: 'worker4',
    name: 'James Wilson',
    role: 'Bartender',
    balance: 150.00,
    rating: 4.6,
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
    restaurantId: 'rest2',
    email: 'james.w@bellavista.com',
    phone: '(555) 777-8888',
    qrCode: 'QR_JAMES_W_004',
    isActive: true
  }
];

export const mockTips: Tip[] = [
  {
    id: 'tip1',
    workerId: 'worker1',
    workerName: 'Sarah Johnson',
    amount: 12.50,
    timestamp: new Date('2025-06-10T14:30:00'),
    customerNote: 'Excellent service!',
    paymentMethod: 'card'
  },
  {
    id: 'tip2',
    workerId: 'worker1',
    workerName: 'Sarah Johnson',
    amount: 8.00,
    timestamp: new Date('2025-06-02T12:15:00'),
    paymentMethod: 'apple_pay'
  },
  {
    id: 'tip3',
    workerId: 'worker1',
    workerName: 'Sarah Johnson',
    amount: 15.75,
    timestamp: new Date('2024-01-15T13:45:00'),
    customerNote: 'Very friendly and helpful',
    paymentMethod: 'google_pay'
  }
];

export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find(r => r.id === id);
}

export function getWorkerById(id: string): Worker | undefined {
  return mockWorkers.find(w => w.id === id);
}

export function getWorkersByRestaurant(restaurantId: string): Worker[] {
  return mockWorkers.filter(w => w.restaurantId === restaurantId && w.isActive);
}

export function getTipsByWorker(workerId: string): Tip[] {
  return mockTips.filter(t => t.workerId === workerId);
}

export function calculateTipStats(tips:any[]): {
  daily: number;
  weekly: number;
  monthly: number;
  totalTips: number;
  averageTip: number;
  tipCount: number;
} {
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const dailyTips = tips.filter(t => new Date(t.created_at) >= today);
  const weeklyTips = tips.filter(t => new Date(t.created_at) >= weekAgo);
  const monthlyTips = tips.filter(t => new Date(t.created_at) >= monthAgo);

  const totalAmount = tips.reduce((sum, tip) => sum + tip.net, 0);
  const averageTip = tips.length > 0 ? totalAmount / tips.length : 0;

  return {
    daily: dailyTips.reduce((sum, tip) => sum + tip.net, 0),
    weekly: weeklyTips.reduce((sum, tip) => sum + tip.net, 0),
    monthly: monthlyTips.reduce((sum, tip) => sum + tip.net, 0),
    totalTips: totalAmount,
    averageTip,
    tipCount: tips.length
  };
}