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
import { superAdminEditWaiter } from '@/services/api/user';
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

interface EditWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: any | null;
  onSave: (updatedWorker: Worker) => void;
  t: any; // Translation function
}

export function EditWorkerModal({ isOpen, onClose, worker, onSave ,t}: EditWorkerModalProps) {
  const [formData, setFormData] = useState<Partial<any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize form data when worker changes
  useEffect(() => {
    if (worker) {
      setFormData({
        id: worker.id,
        name: worker.name,
        waiter_id: worker.waiter_id,
        phone: worker.phone,
        role: worker.role,
        image: worker.image,
        restaurantId: worker.restaurantId,
        isActive: worker.isActive,

       
      });
    }
  }, [worker]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

   

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.role?.trim()) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !worker) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      if(formData.password && formData.password !== formData.passwordAgain) {
        setErrors(prev => ({ ...prev, passwordAgain: 'Passwords do not match' }));
        toast.error('Passwords do not match');
        return;
      }
      const response = await superAdminEditWaiter(formData as any);
      if (!response.success) {
        toast.error(response.error || 'Failed to update worker');
        return;
      }
      toast.success('Worker updated successfully');
      // Update worker data
      
      const updatedWorker: any = {
        ...worker,
        ...formData as any
      };
      
      onSave(updatedWorker);
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

  if (!worker) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[700px] p-0 gap-0">
        <DialogHeader className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <Image
                  src={formData.image || worker.image}
                  alt={formData.name || worker.name}
                  fill
                  className="rounded-full object-cover border-2 border-white shadow-sm"
                />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  {t("Edit Worker")}
                </DialogTitle>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {t("Update worker information and settings")}
                </p>
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
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">Profile Photo</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                  <Image
                    src={formData.image || worker.image}
                    alt={formData.name || worker.name}
                    fill
                    className="rounded-full object-cover border-4 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePhotoUpload}
                    className="w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Photo
                  </Button>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">{t("Basic Information")}</Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t("Full Name")} *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`pl-10 ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
                      placeholder={t("Enter full name")}
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center space-x-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    {t("Role")} *
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className={`pl-10 ${errors.role ? 'border-red-300 focus:border-red-500' : ''}`}
                      placeholder={t("Enter role")}
                    />
                  </div>
                  {errors.role && (
                    <div className="flex items-center space-x-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.role}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("Password")} 
                </Label>
                <div className="relative">
               
                  <Input
                    id="password"
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder={t("Enter password")}
                  />
                </div>
                {errors.password && (
                  <div className="flex items-center space-x-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordAgain" className="text-sm font-medium">
                  {t("Password Again")} 
                </Label>
                <div className="relative">
                  <Input
                    id="passwordAgain"
                    type="password"
                    value={formData.passwordAgain || ''}
                    onChange={(e) => handleInputChange('passwordAgain', e.target.value)}
                    className={`pl-10 ${errors.passwordAgain ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder={t("Enter password again")}
                  />
                </div>
                {errors.passwordAgain && (
                  <div className="flex items-center space-x-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.passwordAgain}</span>
                  </div>
                )}
              </div>

            
            </div>

            {/* Status */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">Status</Label>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Active Status</p>
                    <p className="text-sm text-gray-600">
                      {formData.isActive ? 'Worker is currently active' : 'Worker is inactive'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>
            </div>

            {/* QR Code Info */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">QR Code</Label>
              
              <Card className="border-teal-200 bg-teal-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Personal QR Code</p>
                      <p className="text-sm text-gray-600 font-mono">
                        {formData.qrCode || worker.qrCode}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
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