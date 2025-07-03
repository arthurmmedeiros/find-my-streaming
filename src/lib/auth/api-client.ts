// lib/auth/api-client.ts
import { tokenManager } from './token-manager';
import { AuthenticationError } from '@/types/auth';

/**
 * Enhanced fetch wrapper that automatically handles TMDB authentication
 */
export class TMDBApiClient {
  private readonly baseURL = 'https://api.themoviedb.org/3';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  /**
   * Make an authenticated request to the TMDB API
   */
  async request<T>(
    endpoint: string,
    options: globalThis.RequestInit = {},
    retries: number = 0
  ): Promise<T> {
    try {
      // Get a valid bearer token
      const token = await tokenManager.getValidToken();

      // Prepare the request
      const url = `${this.baseURL}${endpoint}`;
      const requestOptions: globalThis.RequestInit = {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      // Make the request
      const response = await fetch(url, requestOptions);

      // Handle authentication errors
      if (response.status === 401) {
        // Invalidate the current token
        tokenManager.invalidateToken();

        // Retry if we haven't exceeded max retries
        if (retries < this.maxRetries) {
          console.warn(
            `🔄 Retrying request after 401 error (attempt ${retries + 1})`
          );
          await this.delay(this.retryDelay * (retries + 1));
          return this.request<T>(endpoint, options, retries + 1);
        }

        throw new AuthenticationError(
          'Authentication failed after multiple retries',
          401
        );
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      // Parse and return the response
      const data = await response.json();

      // Handle TMDB API-specific errors
      if ('success' in data && data.success === false) {
        throw new Error(`TMDB API Error: ${data.status_message}`);
      }

      return data;
    } catch (error) {
      // If it's an authentication error and we haven't retried much, try again
      if (error instanceof AuthenticationError && retries < this.maxRetries) {
        console.warn(
          `🔄 Retrying request after auth error (attempt ${retries + 1})`
        );
        await this.delay(this.retryDelay * (retries + 1));
        return this.request<T>(endpoint, options, retries + 1);
      }

      // Re-throw the error
      throw error;
    }
  }

  /**
   * Convenience methods for common HTTP verbs
   */
  // async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  //   const url = params
  //     ? `${endpoint}?${new URLSearchParams(params)}`
  //     : endpoint;
  //   return this.request<T>(url, { method: 'GET' });
  // }

  async get<T>(endpoint: string, params?: URLSearchParams): Promise<T> {
    const url = params ? `${endpoint}?${params}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Helper method to add delays between retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Health check endpoint to verify authentication is working
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/configuration');
      return true;
    } catch (error) {
      console.error('TMDB API health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const tmdbApiClient = new TMDBApiClient();
