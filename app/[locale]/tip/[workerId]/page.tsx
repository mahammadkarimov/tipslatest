'use client';

import { use, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getWorkerById, getRestaurantById } from '@/lib/data';
import { TipButton } from '@/components/TipButton';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreatePaymentLink } from '@/services/api/user';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { getWorkerData ,CheckPaymentStatus , WalletPayment , WalletPaymentStatus} from '@/services/api/user';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Heart, 
  Star,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { get } from 'node:http';
import toast from 'react-hot-toast';

export default function TipPage() {
  const params = useParams();
  const tip_slug = params.workerId as string;
  const locale = params.locale as string || 'en';
  const [worker,setWorker] = useState<any>({});
  const restaurant = worker ? getRestaurantById(worker.restaurantId) : null;
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [customerNote, setCustomerNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [showIframe, setShowIframe] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const t = useTranslations('Home');

   useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getWorkerData(tip_slug);
          if (response.success) {
           setWorker(response.data);
           setIsLoading(false);

          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [tip_slug]);


  if (Object.keys(worker).length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Worker Not Found')}</h1>
          <p className="text-gray-600">{t('The worker you selected is not available.')}</p>
        </div>
      </div>
    );
  }


  const getCurrentTipAmount = (): number => {
    if (customAmount) {
      return customAmount || 0;
    }
    return selectedTip;
  };
  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(parseFloat(value));
   
  };

  const handlePayment = async () => {
      setIsProcessing(true);
      const payment_data = {
        "currency": 1,
        "language": "az",
        "amount": getCurrentTipAmount(),
        "description": customerNote || 'No description provided',
        "waiter_slug": params.workerId as string,
        "rate": selectedRating,

      };
  
      if (paymentMethod === 'google_pay' || paymentMethod === 'apple_pay') {
        
        const response = await WalletPayment(payment_data);
        if (response.success) {
          setPaymentLink(response.data.widget_url);
          setTransactionId(response.data.widget_url);
        }
        // Simulate wallet payment processing
        window.addEventListener('message', async (event) => {
          if (event.data && event.data.status === 'success') {
            const paymentStatus = await WalletPaymentStatus(event.data.transaction_id, 'success');
            setIsCompleted(true);
            setIsProcessing(false);
            setShowIframe(false);
          } else if (event.data && event.data.status === 'error') {
            
            setIsProcessing(false);
            setShowIframe(false);
            toast.error(t('Payment failed. Please try again.'));
          }
        });
        setShowIframe(true);
      } else if (paymentMethod === 'card') {
        // Simulate card payment processing
        setTimeout(() => {
          setIsProcessing(true);
          
          CreatePaymentLink(payment_data)
            .then((response) => {
              if (response.success) {
                setPaymentLink(response.data.redirect_url);
                setTransactionId(response.data.transaction);
                setShowIframe(true);
                setTimeout(async () => {
                  try {
                    const intervalId = setInterval(async () => {
                      const statusResponse = await CheckPaymentStatus(response.data.transaction);
                      if (statusResponse.success && statusResponse.data.status === 'success') {
                        clearInterval(intervalId);
                        setIsCompleted(true);
                        setIsProcessing(false);
                        setShowIframe(false);
                      }
                      else if (statusResponse.success && statusResponse.data.status === 'error') {
                        clearInterval(intervalId);
                        setIsProcessing(false);
                        setShowIframe(false);
                        console.error('Payment failed:', statusResponse.data);
                        toast.error(t('Payment failed. Please try again.'));
                      }
                    }, 3000); // Check every 3 seconds
                  } catch (error) {
                    console.error('Error checking payment status:', error);
                    setIsProcessing(false);
                  }
                }, 2000); // Initial delay before starting the interval
                CheckPaymentStatus(response.data.transaction)
                  .then(statusResponse => {
                    if (statusResponse.success) {
                      console.log('Payment status:', statusResponse.data);
                    } else {
                      console.error('Error fetching payment status:', statusResponse.data);
                    }
                  })
                  .catch(error => {
                    console.error('Error checking payment status:', error);
                  });
              } else {
                console.error('Payment link creation failed:', response.data);
              }
            })
            .catch((error) => {
              console.error('Error creating payment link:', error);
            });
            
        }, 2000); // Simulate a delay for processing
      }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-emerald-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 text-center border-2 border-red-200">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('Thank You')}!</h1>
            <p className="text-gray-600 mb-6">
              {t('Your tip of')} {t('has been sent to')} {worker.name}.
            </p>
            <div className="flex items-center justify-center space-x-2 text-yellow-500 mb-6">
              {[...Array(5)].map((_, i) => (
                i < selectedRating ? (
                  <Star key={i} className="w-6 h-6 fill-current" />
                ) : (
                  <Star key={i} className="w-6 h-6 stroke-current" />
                )
              ))}
            </div>
            <Button 
              onClick={() => window.location.href = `/restaurant/${worker.restaurant}`}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('Back to Restaurant')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
    {isLoading && <LoadingScreen />}
    {showIframe && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">{t('Complete Your Payment')}</h2>
      <iframe
        src={paymentLink}
        title="Payment Link"
        className="w-full h-[600px] border rounded-lg"
      ></iframe>
     
    </div>
  </div>
)}

    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-emerald-50">
      <Navbar userType="customer" />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Worker Profile */}
        <Button 
          onClick={() => window.location.href = `/${locale}/restaurant/${worker.restaurant}`} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('Back to Restaurant')}
        </Button>
        <Card className="mb-8 overflow-hidden border-2 border-red-100">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-red-500 to-red-800 p-6 text-white">
              <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16">
            <Image
              src={worker.image}
              alt={worker.name}
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{worker.name}</h1>
            <Badge className="bg-white/20 text-white hover:bg-white/30 mb-2">
              {worker.role}
            </Badge>
            <p className="text-white/90 text-sm">{worker.restaurant || 'Unknown Restaurant'}</p>
          </div>
              </div>
            </div>
          </CardContent>
        </Card>

        
        {/* Rate Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-red-600" />
              <span>{t('Rate Your Experience')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-2 text-yellow-500">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-8 h-8 cursor-pointer ${
                    index < selectedRating ? 'fill-current' : 'stroke-current'
                  }`}
                  onClick={() => setSelectedRating(index + 1)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Tip Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span>{t('Leave a Tip')}</span>
            </CardTitle>
     
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Percentage Buttons */}
            <div className="grid grid-cols-4 gap-3">
              {[10, 15, 20, 25].map((price) => (
                <TipButton
                  key={price}
                  price={price}
                  isSelected={customAmount === price }
                  onClick={() => {setSelectedTip(price)
                    setCustomAmount(price); 
                  }}
                />
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('Custom Amount')}</label>
              <div className="relative">
               
                <Input
                  type="number"
                  placeholder="Minimum ₼1"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-10 text-lg"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Customer Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('Add a note (optional)')}</label>
              <Textarea
                placeholder="Great service! Thank you."
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-red-600" />
              <span>{t('Payment Method')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant={paymentMethod === 'apple_pay' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('apple_pay')}
                className="h-12 text-left justify-start"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Apple Pay
              </Button>
              <Button
                variant={paymentMethod === 'google_pay' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('google_pay')}
                className="h-12 text-left justify-start"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Google Pay
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="h-12 text-left justify-start"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Credit Card
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-6 bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-gray-700">{t('Tip Amount')}:</span>
              <span className="text-red-600">${getCurrentTipAmount().toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={getCurrentTipAmount() <= 0.99 || isProcessing || selectedRating === 0}

          className="w-full h-14 text-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-900 disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t("Processing...")}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>{t('Pay')} ₼{getCurrentTipAmount().toFixed(2)}</span>
            </div>
          )}
        </Button>
      </div>
    </div>
    </>
  );
}