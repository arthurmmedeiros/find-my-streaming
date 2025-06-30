'use client';

import { motion } from 'framer-motion';
import SearchBar from './search-bar';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  const popularSearches = [
    'The Office',
    'Breaking Bad',
    'Stranger Things',
    'The Crown',
    'Mandalorian',
    'Friends',
  ];

  const handlePopularSearch = (query: string) => {
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      {/* Background gradient animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Find where to{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            stream
          </span>{' '}
          your favorite content
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-12"
        >
          Search movies and TV shows across all streaming platforms
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <p className="text-gray-400 mb-4">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => handlePopularSearch(search)}
                className="px-4 py-2 bg-gray-800 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-50 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200 backdrop-blur-sm border border-gray-700 border-opacity-50 hover:border-gray-600 hover:border-opacity-50"
              >
                {search}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
