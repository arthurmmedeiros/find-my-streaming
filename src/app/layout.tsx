import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Finda.Show',
  description: 'Find where to watch your favorite movies and TV shows',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark`}>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
