import { CachedToken, AuthenticationError } from '@/types/auth';

class TokenManager {
  private cachedToken: CachedToken | null = null;
  private refreshPromise: Promise<string> | null = null;
  private readonly TOKEN_BUFFER_TIME = 5 * 60 * 1000; // 5 minutes buffer before expiration

  async getValidToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.cachedToken!.token;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refreshToken();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

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

      const token = apiKey;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

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

  invalidateToken(): void {
    if (this.cachedToken) {
      this.cachedToken.isValid = false;
    }
  }

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

export const tokenManager = new TokenManager();
