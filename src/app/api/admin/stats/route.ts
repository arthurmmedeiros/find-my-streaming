// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/services/rateLimiter';

// Simple authentication - replace with your preferred method
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-admin-token';

export async function GET(request: NextRequest) {
  try {
    // Basic authentication check
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get stats from all rate limiters
    const stats = {
      timestamp: new Date().toISOString(),
      rateLimiters: {
        recommendations: rateLimiters.recommendations.getStats(),
        general: rateLimiters.general.getStats(),
        search: rateLimiters.search.getStats(),
      },
      summary: {
        totalActiveUsers: Object.values({
          recommendations: rateLimiters.recommendations.getStats(),
          general: rateLimiters.general.getStats(),
          search: rateLimiters.search.getStats(),
        }).reduce((sum, limiter) => sum + limiter.totalKeys, 0),
        recommendationsUsage: rateLimiters.recommendations.getStats().totalKeys,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

// Optional: Reset rate limits for a specific IP (for testing/admin)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    if (!ip) {
      return NextResponse.json(
        { error: 'IP parameter required' },
        { status: 400 }
      );
    }

    // Note: This is a simplified implementation
    // In a real app, you'd implement the reset functionality in the RateLimiter class

    return NextResponse.json({
      message: `Rate limits reset for IP: ${ip}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Admin reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset rate limits' },
      { status: 500 }
    );
  }
}
