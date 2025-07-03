// lib/services/rateLimiter.ts
interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (request: Request) => string;
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // Clean up expired entries every 5 minutes
    setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    );
  }

  async checkLimit(request: Request): Promise<{
    allowed: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }> {
    const key = this.config.keyGenerator
      ? this.config.keyGenerator(request)
      : this.getDefaultKey(request);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    let entry = this.store.get(key);

    // Initialize or reset if window has passed
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
        lastRequest: now,
      };
    }

    // Check if request is within the current window
    if (entry.lastRequest < windowStart) {
      entry.count = 0;
      entry.resetTime = now + this.config.windowMs;
    }

    entry.lastRequest = now;
    entry.count++;
    this.store.set(key, entry);

    const allowed = entry.count <= this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    const retryAfter = allowed
      ? undefined
      : Math.ceil((entry.resetTime - now) / 1000);

    return {
      allowed,
      limit: this.config.maxRequests,
      remaining,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  private getDefaultKey(request: Request): string {
    // Try to get IP from various headers (for different deployment environments)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

    const ip =
      forwarded?.split(',')[0]?.trim() || realIp || cfConnectingIp || 'unknown';

    return `rate_limit:${ip}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime <= now) {
        this.store.delete(key);
      }
    }
  }

  // Get current stats for monitoring
  getStats(): {
    totalKeys: number;
    entries: Array<{ key: string; count: number; resetTime: number }>;
  } {
    return {
      totalKeys: this.store.size,
      entries: Array.from(this.store.entries()).map(([key, entry]) => ({
        key: key.replace(/^rate_limit:/, ''), // Remove prefix for privacy
        count: entry.count,
        resetTime: entry.resetTime,
      })),
    };
  }
}

// Pre-configured rate limiters for different endpoints
export const rateLimiters = {
  // Recommendations API - stricter limits due to AI costs
  recommendations: new RateLimiter({
    maxRequests: 10, // 10 requests per user
    windowMs: 15 * 60 * 1000, // 15 minutes
  }),

  // General API - more lenient
  general: new RateLimiter({
    maxRequests: 100, // 100 requests per user
    windowMs: 15 * 60 * 1000, // 15 minutes
  }),

  // Search API - moderate limits
  search: new RateLimiter({
    maxRequests: 60, // 60 requests per user
    windowMs: 15 * 60 * 1000, // 15 minutes
  }),
};

// Utility function to create rate limit response
export function createRateLimitResponse(
  result: Awaited<ReturnType<RateLimiter['checkLimit']>>,
  message?: string
): Response {
  const headers = new Headers({
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  });

  if (result.retryAfter) {
    headers.set('Retry-After', result.retryAfter.toString());
  }

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: message || 'Too many requests. Please try again later.',
        retryAfter: result.retryAfter,
        resetTime: result.resetTime,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(headers.entries()),
        },
      }
    );
  }

  // Return headers for successful requests (can be used by middleware)
  return new Response(null, { status: 200, headers });
}
