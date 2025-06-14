export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  qrCode: string;
}

export interface Tip {
  id: string;
  workerId: string;
  workerName: string;
  amount: number;
  timestamp: Date;
  customerNote?: string;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay';
}

export interface TipStats {
  daily: number;
  weekly: number;
  monthly: number;
  totalTips: number;
  averageTip: number;
  tipCount: number;
}