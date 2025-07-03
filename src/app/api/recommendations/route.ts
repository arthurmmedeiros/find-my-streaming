// app/api/recommendations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '@/lib/services/recommendation';
import { rateLimiters } from '@/lib/services/rateLimiter';
import { createRateLimitedHandler } from '@/lib/middleware/rateLimitMiddleware';

async function recommendationsHandler(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt is too long. Please keep it under 500 characters.' },
        { status: 400 }
      );
    }

    // Additional validation for empty/meaningless prompts
    if (prompt.trim().length < 3) {
      return NextResponse.json(
        { error: 'Prompt is too short. Please be more descriptive.' },
        { status: 400 }
      );
    }

    // Create recommendation service and get results
    const recommendationService = new RecommendationService();
    const result = await recommendationService.getRecommendations(prompt);

    // Add usage tracking (optional)
    console.log(
      `Recommendation request: "${prompt.substring(0, 50)}..." - ${result.results.length} results`
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Recommendation API error:', error);

    // Return more specific error messages for debugging
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }

      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          {
            error:
              'Service is experiencing high demand. Please try again in a few minutes.',
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate recommendations. Please try again.' },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handler
export const POST = createRateLimitedHandler(
  recommendationsHandler,
  rateLimiters.recommendations,
  {
    message:
      'Too many recommendation requests. You can make 10 requests every 15 minutes. Please try again later.',
    skipSuccessfulRequests: false,
  }
);

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed. Use POST to get recommendations.',
      usage: {
        endpoint: '/api/recommendations',
        method: 'POST',
        body: { prompt: 'Your movie/TV request' },
      },
    },
    { status: 405 }
  );
}

export async function PUT() {
  return GET();
}

export async function DELETE() {
  return GET();
}
