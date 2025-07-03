import { RecommendationSearch } from '@/components/recommendation-search';
import Link from 'next/link';

export default function RecommendationsPage() {
  return (
    <main>
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h3zM9 4h6V3H9v1zm7 3H8v9h8V7z"
                  />
                </svg>
              </div>
              <Link href="/" className="text-xl font-bold text-white">
                StreamFinder
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Search
              </Link>
              <Link
                href="/recommendations"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                AI Recommendations
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
