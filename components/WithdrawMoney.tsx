"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownLeft, CreditCard, DollarSign, AlertCircle, CheckCircle2, Wallet } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { withdrawMoney } from '@/services/api/user';
import toast from 'react-hot-toast';
interface BankCard {
    id: string;
   card_mask:string;
   card_name:string;
  }

interface WithdrawModalProps {
  cards: BankCard[];
  balance: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ cards , balance }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  const selectedCard = cards.find(card => card.id === selectedCardId);
  

  const formatCardNumber = (cardNumber: string) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  const validateWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!selectedCardId) {
      setError('Please select a card to withdraw from');
      return false;
    }
    
    if (!withdrawAmount || amount <= 0) {
      setError('Please enter a valid withdrawal amount');
      return false;
    }
    
    if (!selectedCard) {
      setError('Selected card not found');
      return false;
    }
   
    
    if (amount < 1) {
      setError('Minimum withdrawal amount is $10');
      return false;
    }
    
    if (amount > 100) {
      setError('Maximum withdrawal amount is $100 per transaction');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleWithdraw = async () => {
    if (!validateWithdraw()) return;
    // Call the API to process the withdrawal
    try {
        const data = {
            "card_mask": selectedCard?.card_mask,
            "currency": 1,
            "amount": parseFloat(withdrawAmount),
            "description": "Withdrawal from wallet for " + selectedCard?.card_name
        }
        const response = await withdrawMoney(data);
        if (!response.success) {
            setError('Withdrawal failed. Please try again.');
            return;
        }
        toast.success('Withdrawal successful!');
    } catch (error) {
        console.error('Withdrawal error:', error);
        toast.error('An error occurred while processing your withdrawal. Please try again later.');
        return;
    }
    // If validation passes, proceed with withdrawal
    setError('');
    // Set processing state

    
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      const amount = parseFloat(withdrawAmount);
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedCardId('');
        setWithdrawAmount('');
        setIsOpen(false);
      }, 2000);
    }, 2000);
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      return;
    }
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setWithdrawAmount(sanitized);
    setError('');
  };

  const quickAmounts = [50, 100, 200, 500];

  const CardTypeIcon = ({ type }: { type: string }) => {
    const iconClass = "w-6 h-6 text-white";
    switch (type) {
      case 'visa':
        return <div className="bg-blue-600 rounded px-2 py-1 text-xs font-bold text-white">VISA</div>;
      case 'mastercard':
        return <div className="bg-red-600 rounded px-2 py-1 text-xs font-bold text-white">MC</div>;
      case 'amex':
        return <div className="bg-green-600 rounded px-2 py-1 text-xs font-bold text-white">AMEX</div>;
      default:
        return <CreditCard className={iconClass} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
          <ArrowDownLeft className="w-5 h-5 mr-2" />
          Withdraw Money
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white dark:bg-gray-900">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-emerald-600" />
            Withdraw Money
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Withdrawal Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              ${parseFloat(withdrawAmount).toLocaleString()} has been withdrawn from your account
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Total Balance Display */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {balance} ₼
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  
                ₼                </div>
              </div>
            </div>

            {/* Card Selection */}
            <div className="space-y-2">
              <Label htmlFor="card-select">Select Card to Withdraw From</Label>
              <Select value={selectedCardId} onValueChange={setSelectedCardId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a card" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                      
                          <div>
                            <p className="font-medium">{formatCardNumber(card.card_mask)}</p>
                            <p className="text-sm text-gray-500">Balance: </p>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <div className="relative">
                <div className="absolute left-3 top-[15px] transform -translate-y-1/2 w-4 h-4 text-gray-400" >
                ₼</div>
                <Input
                  id="amount"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="pl-10 text-lg font-semibold"
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
         

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Withdraw Button */}
            <Button
              onClick={handleWithdraw}
              disabled={!selectedCardId || !withdrawAmount || isProcessing || !!error}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  Withdraw ${withdrawAmount || '0'}
                </>
              )}
            </Button>

            {/* Transaction Limits Info */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>• Minimum withdrawal: $1</p>
              <p>• Maximum withdrawal: $100 daily</p>
              <p>• Processing time: 10-15 minutes maximum</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;