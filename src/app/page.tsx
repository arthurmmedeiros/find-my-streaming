import SearchBar from '@/components/search-bar';

import { Suspense } from 'react';
import { Film } from 'lucide-react';
import SearchResults from '@/components/results';

type HomeProps = Promise<{
  searchParams: {
    query?: string;
  };
}>;

export default async function Home({ params }: { params: HomeProps }) {
  const {
    searchParams: { query },
  } = await params;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className={`relative ${query ? 'py-12' : 'py-24'} transition-all duration-300`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Film className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Find My Streaming
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover where to watch your favorite movies and TV shows across
              all streaming platforms
            </p>

            <SearchBar
              initialQuery={query ?? ''}
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {query && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <Suspense fallback={<SearchResultsSkeleton />}>
              <SearchResults query={query} />
            </Suspense>
          </div>
        </section>
      )}
    </main>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              <div className="h-10 bg-muted rounded w-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
