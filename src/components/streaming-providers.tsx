import Image from 'next/image';

import { IMAGE_SIZES, API_CONFIG } from '@/lib/config';
import { Tv2 } from 'lucide-react';
import { MediaType, Provider } from '@/types';
import { tmdbApi } from '@/lib/tmdb.api';

interface StreamingProvidersProps {
  mediaType: MediaType;
  id: number;
}

export default async function StreamingProviders({
  mediaType,
  id,
}: StreamingProvidersProps) {
  if (mediaType === 'person') {
    return null;
  }

  try {
    const watchProviders = await tmdbApi.getWatchProviders(mediaType, id);
    const countryProviders = watchProviders.results[API_CONFIG.DEFAULT_COUNTRY];

    if (!countryProviders) {
      return (
        <div className="text-sm text-muted-foreground">
          <p>No streaming information available in your region</p>
        </div>
      );
    }

    //const allProviders: Provider[] = [];
    const providerMap = new Map<number, Provider>();

    // Collect unique providers with priority
    const addProviders = (
      providers: Provider[] | undefined,
      category: string
    ) => {
      console.log(category);
      providers?.forEach((provider) => {
        if (!providerMap.has(provider.provider_id)) {
          providerMap.set(provider.provider_id, provider);
        }
      });
    };

    addProviders(countryProviders.flatrate, 'Stream');
    addProviders(countryProviders.free, 'Free');
    addProviders(countryProviders.rent, 'Rent');
    addProviders(countryProviders.buy, 'Buy');

    const uniqueProviders = Array.from(providerMap.values())
      .sort((a, b) => a.display_priority - b.display_priority)
      .slice(0, 5); // Show top 5 providers

    if (uniqueProviders.length === 0) {
      return (
        <div className="text-sm text-muted-foreground">
          <p>No streaming information available</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium flex items-center gap-1">
          <Tv2 className="h-4 w-4" />
          Available on:
        </h4>
        <div className="flex flex-wrap gap-2">
          {uniqueProviders.map((provider) => {
            const logoUrl = tmdbApi.getImageUrl(
              provider.logo_path,
              IMAGE_SIZES.LOGO.SMALL
            );

            return (
              <div
                key={provider.provider_id}
                className="group relative"
                title={provider.provider_name}
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted border border-border hover:border-primary transition-colors">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={provider.provider_name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tv2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background border border-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {provider.provider_name}
                </span>
              </div>
            );
          })}
        </div>
        {countryProviders.link && (
          <a
            href={countryProviders.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline inline-block mt-2"
          >
            View on TMDB →
          </a>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching streaming providers:', error);
    return (
      <div className="text-sm text-muted-foreground">
        <p>Unable to load streaming information</p>
      </div>
    );
  }
}
