import { tmdbApi } from '@/lib/tmdb.api';
import Image from 'next/image';
import type { MediaType } from '@/types';

export default async function StreamingProviders({
  mediaType,
  id,
}: {
  mediaType: string;
  id: number;
}) {
  try {
    const providerData = await tmdbApi.getWatchProviders(
      mediaType as MediaType,
      id
    );

    // Extract US providers (you can modify this to use other countries)
    const countryProviders = providerData.results?.US;

    if (!countryProviders) {
      return <NoProvidersDisplay />;
    }

    // Combine all provider types (streaming, rental, purchase)
    const allProviders = [
      ...(countryProviders.flatrate || []),
      ...(countryProviders.rent || []),
      ...(countryProviders.buy || []),
    ];

    // Remove duplicates based on provider_id
    const uniqueProviders = allProviders.filter(
      (provider, index, self) =>
        index === self.findIndex((p) => p.provider_id === provider.provider_id)
    );

    if (uniqueProviders.length === 0) {
      return <NoProvidersDisplay />;
    }

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            Available on:
          </h4>
        </div>

        {/* Primary Providers (First 3) */}
        {uniqueProviders.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {uniqueProviders.slice(0, 3).map((provider) => (
              <div
                key={`primary-${provider.provider_id}`}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/60 hover:to-slate-500/60 border border-slate-600/50 rounded-xl px-3 py-2.5 transition-all duration-200 hover:border-slate-500/60 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                title={provider.provider_name}
              >
                <div className="relative w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-slate-500/20">
                  <Image
                    src={
                      tmdbApi.getImageUrl(provider.logo_path, 'original') || ''
                    }
                    alt={provider.provider_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-semibold text-slate-100 truncate max-w-20">
                  {provider.provider_name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Additional Providers (More compact) */}
        {uniqueProviders.length > 3 && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400 font-medium">
              Also available on:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {uniqueProviders.slice(3, 8).map((provider) => (
                <div
                  key={`secondary-${provider.provider_id}`}
                  className="flex items-center gap-1.5 bg-slate-700/30 hover:bg-slate-600/40 border border-slate-600/30 rounded-lg px-2 py-1.5 transition-all duration-200 hover:border-slate-500/40"
                  title={provider.provider_name}
                >
                  <div className="relative w-4 h-4 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        tmdbApi.getImageUrl(provider.logo_path, 'original') ||
                        ''
                      }
                      alt={provider.provider_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs text-slate-300 truncate max-w-16">
                    {provider.provider_name.length > 8
                      ? provider.provider_name.substring(0, 8) + '...'
                      : provider.provider_name}
                  </span>
                </div>
              ))}

              {/* Show remaining count if there are more than 8 providers */}
              {uniqueProviders.length > 8 && (
                <div className="flex items-center justify-center w-8 h-8 bg-slate-600/40 border border-slate-500/30 rounded-lg text-xs font-bold text-slate-300">
                  +{uniqueProviders.length - 8}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Provider Count Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
          <span className="text-xs text-slate-500 font-medium">
            {uniqueProviders.length} platform
            {uniqueProviders.length !== 1 ? 's' : ''} total
          </span>

          {/* Provider Types Indicator */}
          <div className="flex gap-1">
            {countryProviders.flatrate && (
              <div className="px-2 py-0.5 bg-green-600/20 border border-green-500/30 rounded text-xs text-green-400 font-medium">
                Stream
              </div>
            )}
            {(countryProviders.rent || countryProviders.buy) && (
              <div className="px-2 py-0.5 bg-orange-600/20 border border-orange-500/30 rounded text-xs text-orange-400 font-medium">
                Rent/Buy
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching providers:', error);
    return <NoProvidersDisplay />;
  }
}

function NoProvidersDisplay() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">
          Streaming Availability:
        </h4>
      </div>

      <div className="flex items-center gap-3 p-3 bg-slate-700/20 border border-slate-600/30 rounded-xl">
        <div className="w-8 h-8 bg-slate-600/50 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-slate-400 text-sm">?</span>
        </div>
        <div className="text-sm text-slate-400">
          No streaming information available
        </div>
      </div>
    </div>
  );
}

// import Image from 'next/image';

// import { IMAGE_SIZES, API_CONFIG } from '@/lib/config';
// import { Tv2 } from 'lucide-react';
// import { MediaType, Provider } from '@/types';
// import { tmdbApi } from '@/lib/tmdb.api';

// interface StreamingProvidersProps {
//   mediaType: MediaType;
//   id: number;
// }

// export default async function StreamingProviders({
//   mediaType,
//   id,
// }: StreamingProvidersProps) {
//   if (mediaType === 'person') {
//     return null;
//   }

//   try {
//     const watchProviders = await tmdbApi.getWatchProviders(mediaType, id);
//     const countryProviders = watchProviders.results[API_CONFIG.DEFAULT_COUNTRY];

//     if (!countryProviders) {
//       return (
//         <div className="text-sm text-muted-foreground">
//           <p>No streaming information available in your region</p>
//         </div>
//       );
//     }

//     //const allProviders: Provider[] = [];
//     const providerMap = new Map<number, Provider>();

//     // Collect unique providers with priority
//     const addProviders = (
//       providers: Provider[] | undefined,
//       category: string
//     ) => {
//       console.log(category);
//       providers?.forEach((provider) => {
//         if (!providerMap.has(provider.provider_id)) {
//           providerMap.set(provider.provider_id, provider);
//         }
//       });
//     };

//     addProviders(countryProviders.flatrate, 'Stream');
//     addProviders(countryProviders.free, 'Free');
//     addProviders(countryProviders.rent, 'Rent');
//     addProviders(countryProviders.buy, 'Buy');

//     const uniqueProviders = Array.from(providerMap.values())
//       .sort((a, b) => a.display_priority - b.display_priority)
//       .slice(0, 5); // Show top 5 providers

//     if (uniqueProviders.length === 0) {
//       return (
//         <div className="text-sm text-muted-foreground">
//           <p>No streaming information available</p>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-2">
//         <h4 className="text-sm font-medium flex items-center gap-1">
//           <Tv2 className="h-4 w-4" />
//           Available on:
//         </h4>
//         <div className="flex flex-wrap gap-2">
//           {uniqueProviders.map((provider) => {
//             const logoUrl = tmdbApi.getImageUrl(
//               provider.logo_path,
//               IMAGE_SIZES.LOGO.SMALL
//             );

//             return (
//               <div
//                 key={provider.provider_id}
//                 className="group relative"
//                 title={provider.provider_name}
//               >
//                 <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted border border-border hover:border-primary transition-colors">
//                   {logoUrl ? (
//                     <Image
//                       src={logoUrl}
//                       alt={provider.provider_name}
//                       fill
//                       className="object-cover"
//                       sizes="40px"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <Tv2 className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                   )}
//                 </div>
//                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background border border-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
//                   {provider.provider_name}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//         {countryProviders.link && (
//           <a
//             href={countryProviders.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-xs text-primary hover:underline inline-block mt-2"
//           >
//             View on TMDB →
//           </a>
//         )}
//       </div>
//     );
//   } catch (error) {
//     console.error('Error fetching streaming providers:', error);
//     return (
//       <div className="text-sm text-muted-foreground">
//         <p>Unable to load streaming information</p>
//       </div>
//     );
//   }
// }
