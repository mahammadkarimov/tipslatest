import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import {QRCodeSVG } from 'qrcode.react';
interface QRDisplayProps {
  title: string;
  subtitle?: string;
  qrCode: string;
}

export function QRDisplay({ title, subtitle, qrCode }: QRDisplayProps) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5 text-red-600" />
          {title}
        </CardTitle>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <QRCodeSVG 
              value={qrCode}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}