import { tmdbApiClient } from './auth/api-client';

// Types for TMDB API responses
interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface TMDBSearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

/**
 * TMDB service with automatic authentication handling
 */
export class TMDBService {
  /**
   * Search for movies
   */
  async searchMovies(
    query: string,
    options: {
      page?: number;
      year?: number;
      genreIds?: number[];
    } = {}
  ): Promise<TMDBSearchResponse> {
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

    return tmdbApiClient.get<TMDBSearchResponse>('/search/movie', params);
  }

  /**
   * Get movie details by ID
   */
  async getMovieDetails(movieId: number): Promise<TMDBMovie> {
    return tmdbApiClient.get<TMDBMovie>(`/movie/${movieId}`);
  }

  /**
   * Get popular movies
   */
  async getPopularMovies(page: number = 1): Promise<TMDBSearchResponse> {
    return tmdbApiClient.get<TMDBSearchResponse>('/movie/popular', {
      page: page.toString(),
    });
  }

  /**
   * Get movie genres
   */
  async getGenres(): Promise<TMDBGenre[]> {
    const response =
      await tmdbApiClient.get<TMDBGenresResponse>('/genre/movie/list');
    return response.genres;
  }

  /**
   * Health check to verify API connectivity
   */
  async healthCheck(): Promise<boolean> {
    return tmdbApiClient.healthCheck();
  }
}

// Export singleton instance
export const tmdbService = new TMDBService();
