import { CachedToken, AuthenticationError } from '@/types/auth';

/**
 * In-memory token cache - safe for server-side usage only
 * This will be reset on server restarts, which is acceptable for API tokens
 */
class TokenManager {
  private cachedToken: CachedToken | null = null;
  private refreshPromise: Promise<string> | null = null;
  private readonly TOKEN_BUFFER_TIME = 5 * 60 * 1000; // 5 minutes buffer before expiration

  /**
   * Get a valid bearer token, refreshing if necessary
   */
  async getValidToken(): Promise<string> {
    // If we have a valid cached token, return it
    if (this.isTokenValid()) {
      return this.cachedToken!.token;
    }

    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start a new token refresh
    this.refreshPromise = this.refreshToken();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      // Clear the refresh promise regardless of outcome
      this.refreshPromise = null;
    }
  }

  /**
   * Check if the current cached token is still valid
   */
  private isTokenValid(): boolean {
    if (!this.cachedToken) {
      return false;
    }

    const now = new Date();
    const expiresWithBuffer = new Date(
      this.cachedToken.expiresAt.getTime() - this.TOKEN_BUFFER_TIME
    );

    return now < expiresWithBuffer && this.cachedToken.isValid;
  }

  /**
   * Refresh the authentication token from TMDB API
   */
  private async refreshToken(): Promise<string> {
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
      throw new AuthenticationError(
        'TMDB_API_KEY environment variable is not configured'
      );
    }

    try {
      const response = await fetch(
        'https://api.themoviedb.org/3/authentication',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          // Don't cache this specific request
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new AuthenticationError(
          `Authentication failed: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();

      // Handle TMDB API error responses
      if ('success' in data && !data.success) {
        throw new AuthenticationError(
          `TMDB API Error: ${data.status_message}`,
          data.status_code
        );
      }

      // For TMDB, we actually just use the API key as the bearer token
      // The authentication endpoint is more for getting request tokens for user auth
      // For server-to-server requests, we use the API key directly
      const token = apiKey;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Cache the token
      this.cachedToken = {
        token,
        expiresAt,
        isValid: true,
      };

      console.log('🔑 TMDB token refreshed successfully');
      return token;
    } catch (error) {
      // Invalidate cached token on error
      this.invalidateToken();

      if (error instanceof AuthenticationError) {
        throw error;
      }

      throw new AuthenticationError(
        'Failed to refresh authentication token',
        undefined,
        error
      );
    }
  }

  /**
   * Invalidate the current cached token
   */
  invalidateToken(): void {
    if (this.cachedToken) {
      this.cachedToken.isValid = false;
    }
  }

  /**
   * Get token info for debugging (without exposing the actual token)
   */
  getTokenInfo(): {
    hasToken: boolean;
    expiresAt: Date | null;
    isValid: boolean;
  } {
    return {
      hasToken: !!this.cachedToken,
      expiresAt: this.cachedToken?.expiresAt || null,
      isValid: this.cachedToken?.isValid || false,
    };
  }
}

// Singleton instance - safe for server-side usage
export const tokenManager = new TokenManager();
