// components/RecommendationSearch.tsx
'use client';

import React, { useState } from 'react';

import { SearchResult } from '@/types';
import { useRecommendations } from '@/lib/hooks/useRecommendations';
import { tmdbApi } from '@/lib/tmdb.api';

interface RecommendationSearchProps {
  onResultsFound?: (results: SearchResult[]) => void;
  className?: string;
}

export const RecommendationSearch: React.FC<RecommendationSearchProps> = ({
  onResultsFound,
  className = '',
}) => {
  const [prompt, setPrompt] = useState('');
  const {
    recommendations,
    loading,
    error,
    rateLimitInfo,
    getRecommendations,
    clearRecommendations,
  } = useRecommendations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) {
      return;
    }

    await getRecommendations(prompt);
  };

  const handleClear = () => {
    setPrompt('');
    clearRecommendations();
  };

  // Call the callback when results are found (only if provided)
  React.useEffect(() => {
    if (recommendations?.results && onResultsFound) {
      onResultsFound(recommendations.results);
    }
  }, [recommendations, onResultsFound]);

  const examplePrompts = [
    'I want to watch a feel-good comedy movie',
    'Show me highly rated sci-fi TV series',
    'Find me a romantic movie from the 90s',
    "I'm in the mood for a thrilling crime drama",
    'Give me animated movies suitable for kids',
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Main Search Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🎬 AI Movie & TV Recommendations
          </h2>
          <p className="text-gray-600">
            Describe what you are in the mood to watch, and I will find the
            perfect recommendations for you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., I want to watch a comedy movie with good ratings that will make me laugh..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 text-base leading-relaxed font-medium placeholder:text-gray-400 placeholder:font-normal bg-white"
              rows={4}
              maxLength={500}
              disabled={loading}
              style={{
                fontSize: '16px',
                lineHeight: '1.5',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {prompt.length}/500
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Finding recommendations...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Get Recommendations
                </>
              )}
            </button>

            {(recommendations || error) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Rate Limit Info */}
          {rateLimitInfo && rateLimitInfo.remaining !== undefined && (
            <div className="text-xs text-gray-500 mt-2">
              {rateLimitInfo.remaining} requests remaining this window
              {rateLimitInfo.resetTime && (
                <span className="ml-2">
                  (resets at{' '}
                  {new Date(rateLimitInfo.resetTime).toLocaleTimeString()})
                </span>
              )}
            </div>
          )}
        </form>

        {/* Example Prompts */}
        {!recommendations && !loading && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-3">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-red-700 font-medium">Error</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {recommendations && (
        <div className="space-y-6">
          {/* AI Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">AI Analysis</h3>
                <p className="text-blue-700">{recommendations.explanation}</p>

                {/* Search Criteria Display */}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {recommendations.searchCriteria.mediaType !== 'both' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {recommendations.searchCriteria.mediaType}
                    </span>
                  )}
                  {recommendations.searchCriteria.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                  {recommendations.searchCriteria.minRating && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      Rating ≥ {recommendations.searchCriteria.minRating}
                    </span>
                  )}
                  {recommendations.searchCriteria.year && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {recommendations.searchCriteria.year}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {recommendations.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.results.map((item) => (
                <RecommendationCard
                  key={`${item.media_type}-${item.id}`}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.824-2.632M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recommendations found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or being more specific.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Individual recommendation card component
const RecommendationCard: React.FC<{ item: SearchResult }> = ({ item }) => {
  const title = item.media_type === 'movie' ? item.title : item.name;
  const releaseDate =
    item.media_type === 'movie' ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const posterUrl = tmdbApi.getImageUrl(item.poster_path, 'w342');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-[2/3] relative bg-gray-200">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h3zM9 4h6V3H9v1zm7 3H8v9h8V7z"
              />
            </svg>
          </div>
        )}

        {/* Media type badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              item.media_type === 'movie'
                ? 'bg-blue-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            {item.media_type === 'movie' ? 'Movie' : 'TV'}
          </span>
        </div>

        {/* Rating badge */}
        {item.vote_average && item.vote_average > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-medium rounded flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {item.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-medium text-gray-900 mb-1 line-clamp-2"
          title={title}
        >
          {title}
        </h3>

        {year && <p className="text-sm text-gray-500 mb-2">{year}</p>}

        {item.overview && (
          <p
            className="text-sm text-gray-600 line-clamp-3"
            title={item.overview}
          >
            {item.overview}
          </p>
        )}
      </div>
    </div>
  );
};
