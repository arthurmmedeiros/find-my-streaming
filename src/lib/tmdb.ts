// Types for TMDB API responses
type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
};

type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

type WatchProviderResponse = {
  results: {
    [countryCode: string]: {
      flatrate?: Provider[];
      rent?: Provider[];
      buy?: Provider[];
    };
  };
};

// API key should be stored in environment variables

interface CatalogueItem {
  media_type: 'movie' | 'tv';
}

// Function to search for movies and TV shows
export async function getSearchResults(query: string): Promise<SearchResult[]> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not defined');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`,
      { next: { revalidate: 60 * 60 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    // Filter out people and only keep movies and TV shows
    return data.results.filter(
      (item: CatalogueItem) =>
        item.media_type === 'movie' || item.media_type === 'tv'
    );
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
}

// Function to get streaming providers for a specific movie or TV show
export async function getWatchProviders(
  mediaType: string,
  id: number
): Promise<Provider[]> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not defined');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${id}/watch/providers?api_key=${TMDB_API_KEY}`,
      { next: { revalidate: 60 * 60 * 24 } } // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: WatchProviderResponse = await response.json();

    // Use US providers by default, or fall back to first available country
    const countryCode = 'US';
    const countryProviders = data.results[countryCode];

    if (!countryProviders) {
      return [];
    }

    // Combine streaming, rental and purchase options
    const allProviders = [
      ...(countryProviders.flatrate || []),
      ...(countryProviders.rent || []),
      ...(countryProviders.buy || []),
    ];

    // Remove duplicates
    const uniqueProviders = allProviders.filter(
      (provider, index, self) =>
        index === self.findIndex((p) => p.provider_id === provider.provider_id)
    );

    return uniqueProviders;
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return [];
  }
}
