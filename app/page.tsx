import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Users, Store, Smartphone, QrCode, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-8 h-8 text-teal-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Tips BYQR
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/worker/login">
                <Button variant="outline" className="border-teal-200 hover:bg-teal-50">
                  Worker Login
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            QR-Based Tipping Made{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Simple
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your restaurant's tipping experience. Customers scan, select their server, and tip instantly. 
            No apps to download, no accounts to create.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/restaurant/rest1">
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-lg px-8 py-6">
                <QrCode className="w-5 h-5 mr-2" />
                Try Demo QR Code
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="border-2 border-teal-200 hover:bg-teal-50 text-lg px-8 py-6">
                <Store className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">1. Scan QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Customers scan the QR code placed on their table or handed to them by staff.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">2. Select Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Choose the staff member who provided excellent service from the list.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">3. Tip Instantly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Select tip amount and pay instantly with Apple Pay, Google Pay, or card.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Tips BYQR?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">No App Required</h4>
              <p className="text-sm text-gray-600">Works instantly in any mobile browser</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Better Service</h4>
              <p className="text-sm text-gray-600">Staff get recognized for great service</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Digital Payments</h4>
              <p className="text-sm text-gray-600">Secure and instant tip processing</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Setup</h4>
              <p className="text-sm text-gray-600">Get started in minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <CreditCard className="w-6 h-6 text-teal-400" />
            <span className="text-xl font-bold">Tips BYQR</span>
          </div>
          <p className="text-gray-400 mb-6">
            Revolutionizing the tipping experience, one QR code at a time.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/worker/login" className="text-gray-400 hover:text-white transition-colors">
              Worker Portal
            </Link>
            <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">
              Admin Panel
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}