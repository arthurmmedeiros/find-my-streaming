export const API_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  API_KEY: process.env.TMDB_API_KEY || '',
  DEFAULT_COUNTRY: 'US',
  CACHE_DURATION: {
    SEARCH: 60 * 60, // 1 hour
    PROVIDERS: 60 * 60 * 24, // 24 hours
  },
} as const;

export const IMAGE_SIZES = {
  POSTER: {
    SMALL: 'w185',
    MEDIUM: 'w342',
    LARGE: 'w500',
    ORIGINAL: 'original',
  },
  LOGO: {
    SMALL: 'w45',
    MEDIUM: 'w92',
    LARGE: 'w154',
    ORIGINAL: 'original',
  },
} as const;
