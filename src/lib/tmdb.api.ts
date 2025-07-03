import { API_CONFIG } from '@/lib/config';
import {
  isMovie,
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
    if (!query.trim() && (!options.genreIds || options.genreIds.length === 0)) {
      return this.getPopular();
    }

    try {
      const params = new URLSearchParams({
        page: (options.page || 1).toString(),
        include_adult: 'false',
      });

      if (options.genreIds && options.genreIds.length > 0) {
        const [movieResults, tvResults] = await Promise.all([
          this.discoverMovies({
            genreIds: options.genreIds,
            page: options.page,
          }),
          this.discoverTV({ genreIds: options.genreIds, page: options.page }),
        ]);

        const combinedResults = [...movieResults, ...tvResults];

        if (query.trim()) {
          const queryLower = query.toLowerCase();
          return combinedResults.filter((item) => {
            const title = isMovie(item)
              ? item.title.toLowerCase()
              : item.name.toLowerCase();
            const overview = (item.overview || '').toLowerCase();
            return title.includes(queryLower) || overview.includes(queryLower);
          });
        }

        return combinedResults;
      } else {
        params.set('query', query);
        if (options.year) {
          params.set('year', options.year.toString());
        }
      }

      const response = await tmdbApiClient.get<TMDBApiResponse<SearchResult>>(
        '/search/multi',
        params
      );

      return response.results.filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
      );
    } catch (error) {
      console.error('Error fetching search results:', error);
      if (error instanceof TMDBApiError) {
        throw error;
      }
      throw new TMDBApiError('Failed to fetch search results');
    }
  },

  async discoverMovies(
    options: {
      genreIds?: number[];
      page?: number;
      minRating?: number;
      year?: number;
    } = {}
  ): Promise<SearchResult[]> {
    const params = new URLSearchParams({
      page: (options.page || 1).toString(),
      include_adult: 'false',
      sort_by: 'popularity.desc',
    });

    if (options.genreIds && options.genreIds.length > 0) {
      params.set('with_genres', options.genreIds.join(','));
    }

    if (options.minRating) {
      params.set('vote_average.gte', options.minRating.toString());
      params.set('vote_count.gte', '100');
    }

    if (options.year) {
      params.set('year', options.year.toString());
    }

    const response = await tmdbApiClient.get<TMDBApiResponse<SearchResult>>(
      '/discover/movie',
      params
    );

    return response.results;
  },

  async discoverTV(
    options: {
      genreIds?: number[];
      page?: number;
      minRating?: number;
      year?: number;
    } = {}
  ): Promise<SearchResult[]> {
    const params = new URLSearchParams({
      page: (options.page || 1).toString(),
      include_adult: 'false',
      sort_by: 'popularity.desc',
    });

    if (options.genreIds && options.genreIds.length > 0) {
      params.set('with_genres', options.genreIds.join(','));
    }

    if (options.minRating) {
      params.set('vote_average.gte', options.minRating.toString());
      params.set('vote_count.gte', '50'); // Lower threshold for TV shows
    }

    if (options.year) {
      params.set('first_air_date_year', options.year.toString());
    }

    const response = await tmdbApiClient.get<TMDBApiResponse<SearchResult>>(
      '/discover/tv',
      params
    );

    return response.results;
  },

  async getPopular(): Promise<SearchResult[]> {
    try {
      const moviePopular =
        tmdbApiClient.get<TMDBApiResponse<SearchResult>>('/movie/popular');

      const tvPopular =
        tmdbApiClient.get<TMDBApiResponse<SearchResult>>('/tv/popular');
      const [movieResponse, tvResponse] = await Promise.all([
        moviePopular,
        tvPopular,
      ]);

      const combinedResults = [
        ...movieResponse.results.slice(0, 10),
        ...tvResponse.results.slice(0, 10),
      ];

      return combinedResults.sort(() => Math.random() - 0.5).slice(0, 15);
    } catch (error) {
      console.error('Error fetching popular content:', error);
      return [];
    }
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
      `/${mediaType}/${id}/watch/providers`
    );

    return data;
  },

  getImageUrl(path: string | null, size: string = 'original'): string | null {
    if (!path) {
      return null;
    }
    return `${API_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
  },

  async healthCheck(): Promise<boolean> {
    return tmdbApiClient.healthCheck();
  },
};
