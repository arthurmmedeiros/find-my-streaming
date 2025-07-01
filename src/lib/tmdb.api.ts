import { API_CONFIG } from '@/lib/config';
import {
  MediaType,
  SearchResult,
  TMDBApiResponse,
  WatchProviderResponse,
} from '@/types';
import { tmdbApiClient } from './auth/api-client';

class TMDBApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'TMDBApiError';
  }
}

export const tmdbApi = {
  async searchMulti(
    query: string,
    options: {
      page?: number;
      year?: number;
      genreIds?: number[];
    } = {}
  ): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    const params: Record<string, string> = {
      query,
      page: (options.page || 1).toString(),
    };

    if (options.year) {
      params.year = options.year.toString();
    }

    if (options.genreIds?.length) {
      params.with_genres = options.genreIds.join(',');
    }
    const data = await tmdbApiClient.get<TMDBApiResponse<SearchResult>>(
      '/search/multi',
      params
    );

    // Filter out person results and return only movies and TV shows
    return data.results.filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv'
    );
  },

  async getWatchProviders(
    mediaType: MediaType,
    id: number
    //countryCode: string = API_CONFIG.DEFAULT_COUNTRY
  ): Promise<WatchProviderResponse> {
    if (mediaType === 'person') {
      throw new TMDBApiError(
        'Cannot get providers for person',
        400,
        'INVALID_MEDIA_TYPE'
      );
    }

    const data = await tmdbApiClient.get<WatchProviderResponse>(
      `/${mediaType}/${id}/watch/providers`,
      {}
    );

    return data;
  },

  getImageUrl(path: string | null, size: string = 'original'): string | null {
    if (!path) {
      return null;
    }
    return `${API_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
  },
};
