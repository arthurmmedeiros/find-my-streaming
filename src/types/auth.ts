export interface TMDBAuthResponse {
  success: boolean;
  expires_at: string;
  request_token: string;
}

export interface TMDBError {
  success: false;
  status_code: number;
  status_message: string;
}

export interface CachedToken {
  token: string;
  expiresAt: Date;
  isValid: boolean;
}

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
