import { tmdbApi } from '@/lib/tmdb.api';
import Image from 'next/image';
import StreamingProviders from '@/components/streaming-providers';
import { Movie, SearchResult, TVShow } from '@/types';

function isMovie(result: SearchResult): result is Movie {
  return 'title' in result;
}

export default async function SearchResults({ query }: { query: string }) {
  const results = await tmdbApi.searchMulti(query);

  if (results.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="text-8xl mb-6">🔍</div>
          <h3 className="text-3xl font-bold text-white mb-4">
            No results found
          </h3>
          <p className="text-xl text-slate-400 mb-2">
            No results found for{' '}
            <span className="text-blue-400 font-semibold">
              &quot;{query}&quot;
            </span>
          </p>
          <p className="text-slate-500">
            Try a different search term or check your spelling
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-white">
          Results for{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            &quot;{query}&quot;
          </span>
        </h2>
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {results.map((i) => {
          const item = isMovie(i) ? (i as Movie) : (i as TVShow);
          const date = isMovie(i) ? i.release_date : i.first_air_date;
          return (
            <div
              key={item.id}
              className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20"
            >
              {/* Poster Image */}
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                {item.poster_path ? (
                  <Image
                    src={tmdbApi.getImageUrl(item.poster_path, 'w500') || ''}
                    alt={isMovie(i) ? i.title : i.name || 'Movie/TV poster'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <div className="text-5xl mb-3">🎬</div>
                      <span className="text-sm font-medium">
                        No image available
                      </span>
                    </div>
                  </div>
                )}

                {/* Media Type Badge */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${
                      item.media_type === 'tv'
                        ? 'bg-purple-600/90 border-purple-500/50 text-purple-100 shadow-lg shadow-purple-500/20'
                        : 'bg-blue-600/90 border-blue-500/50 text-blue-100 shadow-lg shadow-blue-500/20'
                    }`}
                  >
                    {item.media_type === 'tv' ? 'TV SERIES' : 'MOVIE'}
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Title and Year */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors duration-200">
                    {isMovie(i) ? i.title : i.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-400">
                      {date
                        ? new Date(date || '').getFullYear()
                        : 'Unknown year'}
                    </span>
                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">
                      {item.media_type}
                    </span>
                  </div>
                </div>

                {/* Streaming Providers Section */}
                <div className="border-t border-slate-700/50 pt-4">
                  <StreamingProviders
                    mediaType={item.media_type}
                    id={item.id}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// import MediaCard from '@/components/media-card';
// import { tmdbApi } from '@/lib/tmdb.api';
// import { AlertCircle } from 'lucide-react';

// interface SearchResultsProps {
//   query: string;
// }

// export default async function SearchResults({ query }: SearchResultsProps) {
//   try {
//     console.log('res', query);

//     const results = await tmdbApi.searchMulti(query);

//     if (results.length === 0) {
//       return (
//         <div className="mt-12 text-center">
//           <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//           <p className="text-xl font-medium">No results found for {query}</p>
//           <p className="text-muted-foreground mt-2">
//             Try searching with different keywords or check the spelling
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div className="mt-8 space-y-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold">Results for {query}</h2>
//           <p className="text-muted-foreground">
//             {results.length} {results.length === 1 ? 'result' : 'results'} found
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//           {results.map((item) => (
//             <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
//           ))}
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error('Error fetching search results:', error);
//     return (
//       <div className="mt-12 text-center">
//         <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
//         <p className="text-xl font-medium">Something went wrong</p>
//         <p className="text-muted-foreground mt-2">
//           Please try again later or contact support if the problem persists
//         </p>
//       </div>
//     );
//   }
// }
