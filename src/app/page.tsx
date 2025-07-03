import SearchResults from '@/components/results';
import SearchBar from '@/components/search-bar';
import Link from 'next/link';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h3zM9 4h6V3H9v1zm7 3H8v9h8V7z"
                  />
                </svg>
              </div>
              <Link href="/" className="text-xl font-bold text-white">
                StreamFinder
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Search
              </Link>
              <Link
                href="/recommendations"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                AI Recommendations
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                  Streaming
                </span>
                <br />
                <span className="text-slate-200">Service Finder</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Discover where to watch your favorite movies and TV shows across
                all streaming platforms
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {['Netflix', 'Disney+', 'HBO Max', 'Prime Video', 'Hulu'].map(
                (platform) => (
                  <div
                    key={platform}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-300 text-sm font-medium"
                  >
                    {platform}
                  </div>
                )
              )}
              <div className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
                + Many More
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-16">
            <SearchBar initialQuery={query ?? ''} />
          </div>

          {/* Results Section */}
          {query && (
            <Suspense fallback={<SearchSkeleton />}>
              <SearchResults query={query} />
            </Suspense>
          )}

          {/* Empty State */}
          {!query && (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🎬</div>
              <h3 className="text-2xl font-semibold text-slate-300 mb-4">
                Ready to find your next watch?
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Search for any movie or TV show and we will show you exactly
                where to stream it
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="h-8 w-80 bg-slate-800 rounded-lg animate-pulse"></div>
        <div className="h-6 w-32 bg-slate-800 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden"
            >
              <div className="aspect-[2/3] bg-slate-700/50 animate-pulse"></div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <div className="h-5 bg-slate-700/50 rounded w-4/5 animate-pulse"></div>
                  <div className="h-4 bg-slate-700/50 rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="border-t border-slate-700/50 pt-4 space-y-3">
                  <div className="h-4 bg-slate-700/50 rounded w-3/4 animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-slate-700/50 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-24 bg-slate-700/50 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
