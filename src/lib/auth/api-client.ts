import { tokenManager } from './token-manager';
import { AuthenticationError } from '@/types/auth';

export class TMDBApiClient {
  private readonly baseURL = 'https://api.themoviedb.org/3';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  async request<T>(
    endpoint: string,
    options: globalThis.RequestInit = {},
    retries: number = 0
  ): Promise<T> {
    try {
      const token = await tokenManager.getValidToken();

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

      const response = await fetch(url, requestOptions);

      if (response.status === 401) {
        tokenManager.invalidateToken();

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      if ('success' in data && data.success === false) {
        throw new Error(`TMDB API Error: ${data.status_message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof AuthenticationError && retries < this.maxRetries) {
        console.warn(
          `🔄 Retrying request after auth error (attempt ${retries + 1})`
        );
        await this.delay(this.retryDelay * (retries + 1));
        return this.request<T>(endpoint, options, retries + 1);
      }

      throw error;
    }
  }

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

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

export const tmdbApiClient = new TMDBApiClient();
