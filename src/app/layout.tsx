import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Streaming Service Finder',
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
          {children}
        </div>
      </body>
    </html>
  );
}

// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import { cn } from '@/lib/utils';
// import { ReactNode } from 'react';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Find My Streaming - Discover Where to Watch',
//   description:
//     'Find where to watch your favorite movies and TV shows across all streaming platforms. Search Netflix, Prime Video, Disney+, and more.',
//   keywords:
//     'streaming, movies, tv shows, where to watch, netflix, prime video, disney plus, hulu',
//   openGraph: {
//     title: 'Find My Streaming',
//     description: 'Discover where to watch your favorite movies and TV shows',
//     type: 'website',
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: ReactNode;
// }>) {
//   return (
//     <html lang="en" className="dark">
//       <body
//         className={cn(
//           'min-h-screen bg-background antialiased',
//           inter.className
//         )}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
