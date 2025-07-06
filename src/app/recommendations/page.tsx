import { RecommendationSearch } from '@/components/recommendation-search';

export default function RecommendationsPage() {
  return (
    <main>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Discover Your Next Watch
              </span>
              <br />
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Tell me what you are in the mood for, and I will use AI to find
              the perfect movies and TV shows just for you.
            </p>
          </div>

          <RecommendationSearch />
        </div>
      </div>
    </main>
  );
}
