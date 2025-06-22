"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, CreditCard, MoreVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getBankCards , registerCard } from '@/services/api/user';
import toast from 'react-hot-toast';

interface BankCard {
  id: string;
 card_mask:string;
 card_name:string;
}

interface AddCardFormData {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}

export default function MyCards() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [iframeLink, setIframeLink] = useState<string | null>(null);
  const [cards, setCards] = useState<BankCard[]>([
  ]);

  const [addCardForm, setAddCardForm] = useState<AddCardFormData>({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  });


  useEffect(() => {
    const fetchBankCards = async () => {
      try {
        const response = await getBankCards();
        if (response.success) {
          setCards(response.data);
        } else {
          console.error('Failed to fetch bank cards:');
        }
      } catch (error) {
        console.error('Error fetching bank cards:', error);
      }
    }
    fetchBankCards();
  }, []);
  

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardType = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.match(/^4/)) return 'visa';
    if (number.match(/^5[1-5]/)) return 'mastercard';
    if (number.match(/^3[47]/)) return 'amex';
    return 'discover';
  };

  const maskCardNumber = (cardNumber: string) => {
    if (showCardNumbers) return cardNumber;
    return cardNumber.replace(/\d(?=\d{4})/g, '●');
  };

  const handleAddCard = () => {
     async function registerCardData() {
       const waiter = localStorage.getItem('user_data');
       if (!waiter) {
         console.error('No user data found in localStorage');
            return;
         }
        const parsedWaiter = JSON.parse(waiter);
        const waiterName = parsedWaiter.first_name + ' ' + parsedWaiter.last_name;
        try {
            const response = await registerCard(waiterName);
            if (response.success) {
            setIframeLink(response.data.redirect_url);
            setTimeout(() => {
                
                handleCardSuccess();
            }, 1000);
            } else {
            console.error('Failed to register card:', response.error);
            }
            
        
        } catch (error) {
            console.error('Error registering card:', error);
        }
        
    }
    
   
    registerCardData();
    
  };
  const handleCardSuccess =() => {
   
   
  };


useEffect(() => {
    const interval = setInterval(() => {
        const getCards = async () => {
        
            if (isAddCardOpen) {
                try {
                    const updatedResponse = await getBankCards();
                    if (updatedResponse.success) {
                      const updatedCards = updatedResponse.data;
                      if (JSON.stringify(updatedCards) !== JSON.stringify(cards)) {
                        setCards(updatedCards);
                        setIsAddCardOpen(false);
                        toast.success('Card added successfully!');
                      }
                    } else {
                      console.error('Failed to fetch updated bank cards');
                    }
                  } catch (error) {
                    console.error('Error fetching updated bank cards:', error);
                  }
                }
          };
    getCards();
    
    }, 3000);

    return () => clearInterval(interval);
}, [cards , isAddCardOpen]);

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const CardTypeIcon = ({ type }: { type: string }) => {
    const iconClass = "w-8 h-8 text-white/90";
    switch (type) {
      case 'visa':
        return <div className={`${iconClass} bg-white/20 rounded flex items-center justify-center text-xs font-bold`}>VISA</div>;
      case 'mastercard':
        return <div className={`${iconClass} bg-white/20 rounded flex items-center justify-center text-xs font-bold`}>MC</div>;
      case 'amex':
        return <div className={`${iconClass} bg-white/20 rounded flex items-center justify-center text-xs font-bold`}>AMEX</div>;
      default:
        return <CreditCard className={iconClass} />;
    }
  };

  return (
    <> 
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 shadow-sm flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Manage Cards
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              My Payment Cards
            </DialogTitle>
            <div className="flex items-center gap-2">
        
              <Dialog open={isAddCardOpen} onOpenChange={()=>{
                setIsAddCardOpen(!isAddCardOpen);
                if (!iframeLink) {
                    handleAddCard();
                  }   
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Card</DialogTitle>
                  </DialogHeader>
                  <iframe
                    src={iframeLink || ''}
                    title="Payment Link"
                    className="w-full h-[600px] border rounded-lg"
                  ></iframe>
               
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh] py-4">
          {cards.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Cards Added</h3>
              <p className="text-gray-500 mb-4">Add your first payment card to get started</p>
              <Button onClick={() => {
                setIsAddCardOpen(!isAddCardOpen);
                if (!iframeLink) {
                  handleAddCard();
                }   
              }} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Card
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Card key={card.id} className="group relative overflow-hidden transition-all duration-300  hover:shadow-2xl border-0">
                  <CardContent className="p-0">
                    <div className={` p-6 text-white relative overflow-hidden`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/20"></div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border-2 border-white/20"></div>
                      </div>
                      
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-8 relative z-10">
                       
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCard(card.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Card
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Card Number */}
                      <div className="mb-4 relative z-10">
                        <p className="text-lg font-mono tracking-wider">
                          {card.card_mask}
                        </p>
                      </div>
                      
                      {/* Card Details */}
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <div>
                            <p className="text-sm font-semibold">{card.card_name}</p>
                            
                            </div>
                           
                        </div>
                    
                      
                      {/* Balance */}
                     
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

