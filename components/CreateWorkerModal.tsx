'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { adminCreateWaiter } from '@/services/api/user';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Save,
  AlertCircle,
  CheckCircle,
  Upload,
  UserPlus,
  QrCode,
  Lock
} from 'lucide-react';

interface CreateWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newWorker: Worker) => void;
    t: any; // Translation function
  
}

export function CreateWorkerModal({ isOpen, onClose, onSave, t }: CreateWorkerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '', // Added password property
    photo: '/api/placeholder/150/150', // Default placeholder image
    isActive: true,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedQrCode] = useState(() => `WKR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.role?.trim()) {
      newErrors.role = 'Role is required';
    }
    if (!formData.password?.trim()) {
        newErrors.password = 'Password is required';
      }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      const response = await adminCreateWaiter({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        image: formData.photo,
        isActive: formData.isActive,
      });
        if (!response.success) {
            throw new Error(response.error || 'Failed to create worker');
        }
    
      setShowSuccess(true);
      
      // Auto close after success and reset form
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error creating worker:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      photo: '/api/placeholder/150/150',
      isActive: true,
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  
    const handlePhotoUpload = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (event) => {
            const file = (event.target as HTMLInputElement)?.files?.[0];
            if (file) {
                // Simulate uploading the file and getting a URL
                const reader = new FileReader();
                reader.onload = () => {
                    const uploadedPhotoUrl = reader.result as string;
                    handleInputChange('photo', uploadedPhotoUrl);
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    };
  

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[700px] p-0 gap-0">
        <DialogHeader className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  {t("Add New Worker")}
                </DialogTitle>
                <p className="text-sm text-gray-600 hidden sm:block">
                    {t("Fill in the details to create a new worker profile.")}
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
                    <span className="font-medium">{t("Worker created successfully")}!</span>
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
                    src={formData.photo}
                    alt="Worker profile preview"
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
                    Upload Photo
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
                      value={formData.name}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                      placeholder={t("Enter email address")}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center space-x-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {t("Phone Number")} *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-10 ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                      placeholder={t("Enter phone number")}
                    />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center space-x-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t("Password")} *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="text"
                      value={formData.password}
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

              
              </div>
              
            </div>

            {/* Status */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">Initial Status</Label>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Active Status</p>
                    <p className="text-sm text-gray-600">
                      {formData.isActive ? 'Worker will be created as active' : 'Worker will be created as inactive'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>
            </div>

            {/* QR Code Preview */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">QR Code Preview</Label>
              
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <QrCode className="w-8 h-8 text-emerald-600" />
                      <div>
                        <p className="font-medium text-gray-900">Auto-Generated QR Code</p>
                        <p className="text-sm text-gray-600 font-mono">
                          {generatedQrCode}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-200">
                      New
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
              onClick={handleClose}
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("Creating...")}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>{t("Create Worker")}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}