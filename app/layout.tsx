// app/layout.tsx
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tips BYQR',
  description: 'Tips BYQR - Simplifying Tips Management for Restaurants',
}

// Əgər istifadəçi kök URL-yə girərsə (məs: tips.byqr.app/), onu `defaultLocale`-ə yönləndir
// app/layout.tsx — yalnız metadata varsa saxla
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children;
  }
  