export interface StreamingService {
  id: string;
  name: string;
  link: string;
  price?: string;
  quality?: string;
}

// Base interfaces for API responses
export interface TMDBApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Media types
export type MediaType = 'movie' | 'tv' | 'person';

// Base media interface
export interface BaseMedia {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  media_type: MediaType;
}

// Movie specific interface
export interface Movie extends BaseMedia {
  media_type: 'movie';
  title: string;
  original_title: string;
  release_date: string;
  adult: boolean;
}

// TV Show specific interface
export interface TVShow extends BaseMedia {
  media_type: 'tv';
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

// Search result can be either Movie or TV Show
export type SearchResult = Movie | TVShow;

// Provider interfaces
export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface CountryProviders {
  link?: string;
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
  free?: Provider[];
}

export interface WatchProviderResponse {
  id: number;
  results: {
    [countryCode: string]: CountryProviders;
  };
}

export function isMovie(media: SearchResult): media is Movie {
  return media.media_type === 'movie';
}

export function isTVShow(media: SearchResult): media is TVShow {
  return media.media_type === 'tv';
}
