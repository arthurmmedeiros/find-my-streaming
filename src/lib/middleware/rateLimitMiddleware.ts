// lib/middleware/rateLimitMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  RateLimiter,
  createRateLimitResponse,
} from '@/lib/services/rateLimiter';

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  rateLimiter: RateLimiter,
  options: {
    message?: string;
    skipSuccessfulRequests?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Check rate limit
      const result = await rateLimiter.checkLimit(request);

      // If rate limit exceeded, return error response
      if (!result.allowed) {
        return createRateLimitResponse(result, options.message) as NextResponse;
      }

      // Execute the original handler
      const response = await handler(request);

      // Add rate limit headers to successful responses
      if (!options.skipSuccessfulRequests) {
        response.headers.set('X-RateLimit-Limit', result.limit.toString());
        response.headers.set(
          'X-RateLimit-Remaining',
          result.remaining.toString()
        );
        response.headers.set(
          'X-RateLimit-Reset',
          new Date(result.resetTime).toISOString()
        );
      }

      return response;
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      // If rate limiting fails, allow the request to proceed
      return handler(request);
    }
  };
}

// Higher-order function for easy use with API routes
export function createRateLimitedHandler<T extends NextRequest>(
  handler: (request: T) => Promise<NextResponse>,
  rateLimiter: RateLimiter,
  options?: {
    message?: string;
    skipSuccessfulRequests?: boolean;
  }
) {
  return withRateLimit(handler as any, rateLimiter, options) as (
    request: T
  ) => Promise<NextResponse>;
}
