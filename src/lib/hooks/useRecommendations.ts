// hooks/useRecommendations.ts
import { useState } from 'react';
import { RecommendationResult } from '@/lib/services/recommendation';

interface UseRecommendationsReturn {
  recommendations: RecommendationResult | null;
  loading: boolean;
  error: string | null;
  rateLimitInfo: {
    remaining?: number;
    resetTime?: string;
    retryAfter?: number;
  } | null;
  getRecommendations: (prompt: string) => Promise<void>;
  clearRecommendations: () => void;
}

export const useRecommendations = (): UseRecommendationsReturn => {
  const [recommendations, setRecommendations] =
    useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remaining?: number;
    resetTime?: string;
    retryAfter?: number;
  } | null>(null);

  const getRecommendations = async (prompt: string) => {
    if (!prompt.trim()) {
      setError('Please enter a search prompt');
      return;
    }

    if (prompt.trim().length < 3) {
      setError('Please be more descriptive in your search');
      return;
    }

    setLoading(true);
    setError(null);
    setRateLimitInfo(null);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      // Extract rate limit headers
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const retryAfter = response.headers.get('Retry-After');

      setRateLimitInfo({
        remaining: remaining ? parseInt(remaining) : undefined,
        resetTime: resetTime || undefined,
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 429) {
          const retryMinutes = Math.ceil((errorData.retryAfter || 60) / 60);
          throw new Error(
            `Too many requests. Please wait ${retryMinutes} minute${retryMinutes > 1 ? 's' : ''} before trying again.`
          );
        }

        throw new Error(errorData.error || 'Failed to get recommendations');
      }

      const result = await response.json();
      setRecommendations(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      setRecommendations(null);

      console.error('Recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearRecommendations = () => {
    setRecommendations(null);
    setError(null);
    setRateLimitInfo(null);
  };

  return {
    recommendations,
    loading,
    error,
    rateLimitInfo,
    getRecommendations,
    clearRecommendations,
  };
};
