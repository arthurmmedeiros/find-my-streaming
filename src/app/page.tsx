import { Suspense } from 'react';
import Hero from '@/components/hero';
import LoadingSpinner from '@/components/loading-spinner';
import { Metadata } from 'next';
import Link from 'next/link';
import SearchSection from '@/components/search-section';

interface PageProps {
  searchParams: { q?: string };
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const query = await searchParams.q;

  if (query) {
    return {
      title: `${query} - Find Streaming Services | FindMyStreaming`,
      description: `Find where to stream "${query}" across Netflix, Prime Video, Disney+, and more streaming platforms.`,
    };
  }

  return {
    title: 'FindMyStreaming - Search Movies & TV Shows Across All Platforms',
    description:
      'Discover where to stream your favorite movies and TV shows across all major streaming platforms including Netflix, Prime Video, Disney+, and more.',
  };
}

export default function Home({ searchParams }: PageProps) {
  const hasSearch = !!searchParams.q;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-lg z-50 border-b border-gray-700 border-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
              >
                FindMyStreaming
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {!hasSearch ? (
          <Hero />
        ) : (
          <Suspense
            fallback={
              <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                  <LoadingSpinner />
                </div>
              </div>
            }
          >
            <SearchSection searchQuery={searchParams.q ?? ''} />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-gray-500">
        <p>&copy; 2024 FindMyStreaming. All rights reserved.</p>
      </footer>
    </div>
  );
}
