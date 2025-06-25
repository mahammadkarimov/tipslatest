'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { superAdminEditWaiter,superAdminGetWaiters ,superAdminEditQrCode , superAdminRestaurants, superAdminCreateWaiter, superAdminCreateQrCode} from '@/services/api/user';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Camera, 
  Save,
  AlertCircle,
  CheckCircle,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import { QRDisplay2 } from './QRDisplay';

interface CreateQRCODEProps {
  isOpen: boolean;
  onClose: () => void;
  t: any; // Translation function
}

export function CreateQRCODE({ isOpen, onClose, t }: CreateQRCODEProps) {
  const [formData, setFormData] = useState<Partial<any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<any[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(formData.searchTerm || "");
  const [localRestSearchTerm, setLocalRestSearchTerm] = useState("");

  

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await superAdminRestaurants();
        if (response.success) {
          setRestaurants(response.data);
          setFilteredRestaurants(response.data);
        } else {
          toast.error(response.error || 'Failed to fetch restaurants');
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        toast.error('An error occurred while fetching restaurants');
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const searchTerm = localSearchTerm.toLowerCase();
      const filtered = workers.filter((worker) =>
        (worker.name || "").toLowerCase().includes(searchTerm)
      );
      setFilteredWorkers(filtered);
    }, 200);
  
    return () => clearTimeout(delayDebounce);
  }, [localSearchTerm, workers]);
  
    // Fetch workers when component mounts
    useEffect(() => {
        const fetchWorkers = async () => {
            try {
            const response = await superAdminGetWaiters();
            if (response.success) {
                setWorkers(response.data);
                setFilteredWorkers(response.data); // Initialize filtered workers
            } else {
                toast.error(response.error || 'Failed to fetch workers');
            }
            } catch (error) {
            console.error('Error fetching workers:', error);
            toast.error('An error occurred while fetching workers');
            }
        };
    
        fetchWorkers();
        }, []);
  // Initialize form data when worker changes
  

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.qr_code_id) {
      newErrors.qr_code_id = t("QR Code ID is required");
    }
    if (!formData.waiter) {
      newErrors.worker = t("Worker is required");
    }
    if (!formData.restaurant) {
      newErrors.restaurant = t("Restaurant is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    

    setIsLoading(true);
    
    try {
      // Simulate API call
      
      const response = await superAdminCreateQrCode(formData as any);
      if (!response.success) {
        toast.error(response.error || 'Failed to update QR code');
        return;
      }
      toast.success('Worker created successfully');
      // Update worker data
  
      
     
      setShowSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error updating worker:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field as string]) {
        setErrors(prev => ({ ...prev, [field as string]: '' }));
      }
  };


    const handlePhotoUpload = async () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
        toast.error('File size exceeds 2MB. Please upload a smaller file.');
        return;
        }
        const reader = new FileReader();
        reader.onload = () => {
        const imageUrl = reader.result as string;
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        };
        reader.readAsDataURL(file);
      }
      };
      fileInput.click();
    
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[700px] p-0 gap-0">
        <DialogHeader className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className=" ">
               
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  {t("Create Worker")}
                </DialogTitle>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {t("Update worker information and settings")}
                </p>
               <div className='mt-10'>

               </div>
              </div>
            </div>
            
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Success Message */}
            {showSuccess && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{t("Worker updated successfully")}!</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profile Photo Section */}
         

            {/* Basic Information */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">{t("Basic Information")}</Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="worker-select">{t("Select Worker")}</Label>
                    <Select
                        onValueChange={(value) => handleInputChange("waiter", value)}
                        value={formData.waiter || ""}
                    >
                        <SelectTrigger id="worker-select" className="w-full">
                            <SelectValue placeholder={t("Search and choose a worker")} />
                        </SelectTrigger>
                        <SelectContent>
                            <Input
                                placeholder={t("Search worker")}
                                className="mb-2"
                                value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
                            />
                            {filteredWorkers.map((worker) => (
                                <SelectItem key={worker.id} value={worker.id}>
                                    {worker.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.worker && <p className="text-red-500 text-sm">{errors.worker}</p>}

            
            </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="restaurant-select">{t("Select Restaurant")}</Label>
                    <Select
                        onValueChange={(value) => handleInputChange("restaurant", value)}
                        value={formData.restaurant || ""}
                    >
                        <SelectTrigger id="restaurant-select" className="w-full">
                            <SelectValue placeholder={t("Search and choose a restaurant")} />
                        </SelectTrigger>
                        <SelectContent>
                            <Input
                                placeholder={t("Search restaurant")}
                                className="mb-2"
                                value={localRestSearchTerm}
                                onChange={(e) => setLocalRestSearchTerm(e.target.value)}
                            />
                            {filteredRestaurants.map((restaurant) => (
                                <SelectItem key={restaurant.id} value={restaurant.id}>
                                    {restaurant.restaurant_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.restaurant && <p className="text-red-500 text-sm">{errors.restaurant}</p>}

            
            </div>
            </div>
          

            
          </div>
          
        </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("Saving")}...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>{t("Save Changes")}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}