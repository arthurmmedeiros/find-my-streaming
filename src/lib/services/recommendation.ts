// lib/services/recommendation.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SearchResult } from '@/types';
import { tmdbApi } from '../tmdb.api';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface RecommendationCriteria {
  mediaType: 'movie' | 'tv' | 'both';
  genres: string[];
  minRating?: number;
  year?: number;
  keywords: string[];
  mood?: string;
}

export interface RecommendationResult {
  results: SearchResult[];
  explanation: string;
  searchCriteria: RecommendationCriteria;
}

// Genre mapping from natural language to TMDB genre IDs
const GENRE_MAPPING: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  'science fiction': 878,
  'sci-fi': 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

export class RecommendationService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getRecommendations(prompt: string): Promise<RecommendationResult> {
    try {
      // Step 1: Extract criteria from prompt using Gemini
      const criteria = await this.extractCriteria(prompt);

      // Step 2: Search TMDB based on criteria
      const searchResults = await this.searchContent(criteria);
      // Step 3: Generate explanation
      const explanation = await this.generateExplanation(
        prompt,
        criteria,
        searchResults
      );

      return {
        results: searchResults,
        explanation,
        searchCriteria: criteria,
      };
    } catch (error) {
      console.error('Recommendation error:', error);
      throw new Error('Failed to generate recommendation');
    }
  }

  private async extractCriteria(
    prompt: string
  ): Promise<RecommendationCriteria> {
    const systemPrompt = `
You are a movie/TV recommendation expert. Extract search criteria from the user's prompt and return ONLY a valid JSON object.

Guidelines:
- mediaType: "movie", "tv", or "both" based on what they want
- genres: array of genre names (action, comedy, romance, horror, etc.)
- minRating: number 0-10 if they mention wanting good/high ratings (default 7 for "good ratings")
- year: specific year or decade if mentioned
- keywords: important descriptive words for search
- mood: overall feeling they want (happy, sad, exciting, relaxing, etc.)

Example responses:
{"mediaType": "movie", "genres": ["romance"], "minRating": 7, "keywords": ["love", "romantic"], "mood": "romantic"}
{"mediaType": "both", "genres": ["action", "thriller"], "keywords": ["fast-paced", "suspense"]}

User prompt: "${prompt}"

Return only the JSON object:`;

    const result = await this.model.generateContent(systemPrompt);

    const responseText = result.response.text().trim();
    console.log(responseText);
    try {
      // Clean up the response to extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const criteria = JSON.parse(jsonMatch[0]);

      // Validate and set defaults
      return {
        mediaType: criteria.mediaType || 'both',
        genres: Array.isArray(criteria.genres) ? criteria.genres : [],
        minRating: criteria.minRating || undefined,
        year: criteria.year || undefined,
        keywords: Array.isArray(criteria.keywords) ? criteria.keywords : [],
        mood: criteria.mood || undefined,
      };
    } catch (parseError) {
      console.error('Failed to parse criteria:', parseError);
      // Fallback to basic keyword extraction
      return this.fallbackCriteria(prompt);
    }
  }

  private fallbackCriteria(prompt: string): RecommendationCriteria {
    const lowerPrompt = prompt.toLowerCase();

    // Basic keyword detection
    const genres: string[] = [];
    Object.keys(GENRE_MAPPING).forEach((genre) => {
      if (lowerPrompt.includes(genre)) {
        genres.push(genre);
      }
    });

    const mediaType = lowerPrompt.includes('movie')
      ? 'movie'
      : lowerPrompt.includes('tv') || lowerPrompt.includes('series')
        ? 'tv'
        : 'both';

    const minRating =
      lowerPrompt.includes('good') || lowerPrompt.includes('high')
        ? 7
        : undefined;

    return {
      mediaType,
      genres,
      minRating,
      keywords: prompt.split(' ').filter((word) => word.length > 3),
    };
  }

  private async searchContent(
    criteria: RecommendationCriteria
  ): Promise<SearchResult[]> {
    const searches: Promise<SearchResult[]>[] = [];

    // Convert genre names to IDs
    const genreIds = criteria.genres
      .map((genre) => GENRE_MAPPING[genre.toLowerCase()])
      .filter((id) => id !== undefined);

    // Determine which media types to search
    const searchMovies =
      criteria.mediaType === 'movie' || criteria.mediaType === 'both';
    const searchTV =
      criteria.mediaType === 'tv' || criteria.mediaType === 'both';

    // Search with genres using discover endpoints
    if (genreIds.length > 0) {
      if (searchMovies) {
        searches.push(
          tmdbApi.discoverMovies({
            genreIds,
            page: 1,
            minRating: criteria.minRating,
            year: criteria.year,
          })
        );
      }

      if (searchTV) {
        searches.push(
          tmdbApi.discoverTV({
            genreIds,
            page: 1,
            minRating: criteria.minRating,
            year: criteria.year,
          })
        );
      }
    }

    // Search with keywords using regular search
    if (criteria.keywords.length > 0) {
      const keywordQuery = criteria.keywords.join(' ');
      searches.push(
        tmdbApi.searchMulti(keywordQuery, {
          page: 1,
          year: criteria.year,
        })
      );
    }

    // If no specific criteria, get popular content
    if (searches.length === 0) {
      searches.push(tmdbApi.getPopular());
    }

    // Execute all searches
    const results = await Promise.all(searches);

    // Combine and deduplicate results
    const combinedResults = results.flat();
    const uniqueResults = combinedResults.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (other) =>
            other.id === item.id && other.media_type === item.media_type
        )
    );

    // Filter by media type if specified (in case some results slipped through)
    let filteredResults = uniqueResults;
    if (criteria.mediaType !== 'both') {
      filteredResults = uniqueResults.filter(
        (item) => item.media_type === criteria.mediaType
      );
    }

    // Filter by rating if specified and not already filtered
    if (criteria.minRating && !genreIds.length) {
      filteredResults = filteredResults.filter(
        (item) =>
          (item.vote_average || 0) >= criteria.minRating! &&
          (item.vote_count || 0) >= 50
      );
    }

    // Sort by popularity and rating combination
    return filteredResults
      .sort((a, b) => {
        const aScore =
          (a.vote_average || 0) * Math.log((a.popularity || 1) + 1);
        const bScore =
          (b.vote_average || 0) * Math.log((b.popularity || 1) + 1);
        return bScore - aScore;
      })
      .slice(0, 12); // Return top 12 results for better grid layout
  }

  private async generateExplanation(
    originalPrompt: string,
    criteria: RecommendationCriteria,
    results: SearchResult[]
  ): Promise<string> {
    if (results.length === 0) {
      return "I couldn't find any results matching your criteria. Try adjusting your search terms.";
    }

    const explanationPrompt = `
Generate a brief, friendly explanation for why these recommendations match the user's request.

User asked for: "${originalPrompt}"
Search criteria found: ${JSON.stringify(criteria)}
Number of results: ${results.length}

Write a 1-2 sentence explanation that's conversational and helpful.
Examples:
- "Based on your request for romance movies with good ratings, I found 8 highly-rated romantic films that should be perfect for a cozy night in."
- "Here are 5 thrilling action movies that match your criteria - all have great ratings and plenty of excitement."

Keep it concise and natural:`;

    try {
      const result = await this.model.generateContent(explanationPrompt);
      return result.response.text().trim();
    } catch {
      return `I found ${results.length} recommendations based on your search for ${criteria.genres.join(', ')} content.`;
    }
  }
}
