'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Tip } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DollarSign, 
  Calendar, 
  Search, 
  Filter,
  TrendingUp,
  Clock,
  CreditCard,
  MessageSquare,
  X
} from 'lucide-react';

interface TipsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tips: Tip[];
  workerName: string;
  workerPhoto: string;
  t?: any; // Translation function, optional
}

export function TipsHistoryModal({ isOpen, onClose, tips, workerName, workerPhoto , t }: TipsHistoryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'net' >('date');
  const [filterBy, setFilterBy] = useState<'all' | 'today' | 'week' | 'month'>('all');

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

  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterTips = (tips: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let filtered = tips;

    // Filter by time period
    switch (filterBy) {
      case 'today':
        filtered = tips.filter(tip => tip.created_at >= today);
        break;
      case 'week':
        filtered = tips.filter(tip => tip.created_at >= weekAgo);
        break;
      case 'month':
        filtered = tips.filter(tip => tip.created_ad >= monthAgo);
        break;
      default:
        filtered = tips;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tip => 
        tip.customerNote?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.net.toString().includes(searchTerm)
      );
    }

    // Sort tips
    switch (sortBy) {
      case 'net':
        filtered.sort((a, b) => b.net - a.net);
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(b.created_at).getTime());
    }

    return filtered;
  };

  const filteredTips = filterTips(tips);
  const totalnet = filteredTips.reduce((sum, tip) => sum + tip.net, 0);
  const averagenet = filteredTips.length > 0 
      ? totalnet / filteredTips.length 
      : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src={workerPhoto}
                  alt={workerName}
                  fill
                  className="rounded-full object-cover border-2 border-teal-200"
                />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {t("Tips History")}
                </DialogTitle>
                <p className="text-gray-600">{workerName}</p>
              </div>
            </div>
            
          </div>
        </DialogHeader>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 flex-shrink-0">
          <Card className="border-2 border-green-100 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{t("Total net")}</p>
                  <p className="text-xl font-bold text-green-700">₼{parseFloat(totalnet).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-blue-100 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">{t("Average Tip")}</p>
                  <p className="text-xl font-bold text-blue-700">₼{averagenet.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
         
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t("Search tips by net, percentage, or note")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Time")}</SelectItem>
              <SelectItem value="today">{t("Today")}</SelectItem>
              <SelectItem value="week">{t("This Week")}</SelectItem>
              <SelectItem value="month">{t("This Month")}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">{t("Sort by Date")}</SelectItem>
              <SelectItem value="net">{t("Sort by Amount")}</SelectItem>
           
            </SelectContent>
          </Select>
        </div>

        {/* Tips List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTips.length > 0 ? (
            <div className="space-y-4">
              {filteredTips.map((tip) => (
                <Card key={tip.id} className="border border-gray-200 hover:border-teal-200 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-2xl font-bold text-gray-900">
                            ₼{parseFloat(tip.net).toFixed(2)}
                            </span>
                          </div>
                          
                          <span className="text-lg">
                            {getPaymentMethodIcon(tip.payment_method)}
                          </span>
                        </div>
                        
                        {tip.customerNote && (
                          <div className="flex items-start space-x-2 mt-3 p-3 bg-gray-50 rounded-lg">
                            <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700 italic">
                              "{tip.customerNote}"
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="flex items-center space-x-1 text-gray-500 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {formatDate(tip.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-xs capitalize">
                            {tip.payment_method.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tips found</h3>
              <p className="text-gray-600">
                {searchTerm || filterBy !== 'all' 
                  ? t('Try adjusting your search or filter criteria') 
                  : t('Tips will appear here as customers leave them')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 flex-shrink-0">
          <p className="text-sm text-gray-600">
            Showing {filteredTips.length} of {tips.length} tips
          </p>
          <Button onClick={onClose} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500">
            {t("Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}