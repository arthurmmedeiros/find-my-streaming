import { NextResponse } from 'next/server';
import { tmdbApi } from '@/lib/tmdb.api';
import { tokenManager } from '@/lib/auth/token-manager';

export async function GET() {
  try {
    const isHealthy = await tmdbApi.healthCheck();

    const tokenInfo = tokenManager.getTokenInfo();

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      tmdb: {
        accessible: isHealthy,
        authenticated: tokenInfo.isValid,
        tokenExpiry: tokenInfo.expiresAt?.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
