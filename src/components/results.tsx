import MediaCard from '@/components/media-card';
import { tmdbApi } from '@/lib/tmdb.api';
import { AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  query: string;
}

export default async function SearchResults({ query }: SearchResultsProps) {
  try {
    console.log('res', query);

    const results = await tmdbApi.searchMulti(query);

    if (results.length === 0) {
      return (
        <div className="mt-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl font-medium">No results found for {query}</p>
          <p className="text-muted-foreground mt-2">
            Try searching with different keywords or check the spelling
          </p>
        </div>
      );
    }

    return (
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Results for {query}</h2>
          <p className="text-muted-foreground">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {results.map((item) => (
            <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching search results:', error);
    return (
      <div className="mt-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="text-xl font-medium">Something went wrong</p>
        <p className="text-muted-foreground mt-2">
          Please try again later or contact support if the problem persists
        </p>
      </div>
    );
  }
}
