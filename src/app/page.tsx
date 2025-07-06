import SearchResults from '@/components/results';
import SearchBar from '@/components/search-bar';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
