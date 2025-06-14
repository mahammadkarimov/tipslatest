'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TipButtonProps {
  price: number;
  isSelected: boolean;
  onClick: () => void;
}

export function TipButton({ price, isSelected, onClick }: TipButtonProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        "h-[50px] flex flex-col space-y-1 transition-all duration-300",
        isSelected 
          ? "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg scale-105" 
          : "hover:border-red-300 hover:bg-red-50"
      )}
    >
      <span className="text-m font-bold">{price.toFixed(2)} ₼</span>
   
    </Button>
  );
}