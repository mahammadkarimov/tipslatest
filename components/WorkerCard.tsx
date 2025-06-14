'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, User } from 'lucide-react';

interface WorkerCardProps {
  worker: any;
  onSelect: () => void;
  t:any;
}

export function WorkerCard({ worker, onSelect , t }: WorkerCardProps) {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-teal-200">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            <Image
              src={worker.image}
              alt={worker.name}
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg group-hover:border-teal-100 transition-colors"
            />
           
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-teal-700 transition-colors">
              {worker.name}
            </h3>
            <Badge variant="secondary" className="bg-teal-50 text-teal-700 hover:bg-teal-100">
              {worker.role}
            </Badge>
          </div>

          <div className="flex items-center space-x-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={ worker.rating > i ? "w-4 h-4 fill-current" : "w-4 h-4 "} />
            ))}
            <span className="text-sm text-gray-600 ml-2">({worker.rating})</span>
          </div>

            <Button 
            onClick={onSelect}
            className="w-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
            >
            <User className="w-4 h-4 mr-2" />
            {t('Tip')} 
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}