// app/recommendations/page.tsx
// Or you can integrate this into your existing search page

import { RecommendationSearch } from '@/components/recommendation-search';

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Next Watch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell me what you are in the mood for, and I will use AI to find the
            perfect movies and TV shows just for you.
          </p>
        </div>

        <RecommendationSearch />
      </div>
    </div>
  );
}
