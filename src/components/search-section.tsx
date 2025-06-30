import { searchStreamingServices } from '@/lib/api';
import StreamingResults from '@/components/results';
import SearchBar from '@/components/search-bar';
import MotionWrapper from '@/components/motion-wrapper';
import { SearchResult } from '@/types';

interface SearchSectionProps {
  searchQuery: string;
}

export default async function SearchSection({
  searchQuery,
}: SearchSectionProps) {
  let results: SearchResult[] = [];
  let error = null;

  try {
    results = await searchStreamingServices(searchQuery);
  } catch (err) {
    error =
      err instanceof Error ? err.message : 'An error occurred while searching.';
  }

  return (
    <MotionWrapper className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <SearchBar initialValue={searchQuery} isCompact />

        {/* Results Section */}
        <div className="mt-8">
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {!error && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No results found for &quot;{searchQuery}&quot;
              </p>
              <p className="text-gray-500 mt-2">
                Try searching with a different title or keyword
              </p>
            </div>
          )}

          {!error && results.length > 0 && (
            <StreamingResults results={results} />
          )}
        </div>
      </div>
    </MotionWrapper>
  );
}
