import { SearchResult } from '@/types';
import { motion } from 'framer-motion';
import { Play, Star, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';

interface StreamingResultsProps {
  results: SearchResult[];
}

const platformLogos: Record<string, string> = {
  netflix: '/logos/netflix.png',
  'amazon-prime': '/logos/prime.png',
  'disney-plus': '/logos/disney.png',
  hulu: '/logos/hulu.png',
  'hbo-max': '/logos/hbo.png',
  'apple-tv': '/logos/apple.png',
  peacock: '/logos/peacock.png',
  paramount: '/logos/paramount.png',
};

const platformColors: Record<string, string> = {
  netflix: 'from-red-600 to-red-700',
  'amazon-prime': 'from-blue-500 to-blue-600',
  'disney-plus': 'from-blue-600 to-blue-700',
  hulu: 'from-green-500 to-green-600',
  'hbo-max': 'from-purple-600 to-purple-700',
  'apple-tv': 'from-gray-700 to-gray-800',
  peacock: 'from-yellow-500 to-orange-500',
  paramount: 'from-blue-400 to-blue-500',
};

export default function StreamingResults({ results }: StreamingResultsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      {results.map((result, index) => (
        <motion.div
          key={`${result.id}-${index}`}
          variants={item}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row">
            {/* Poster */}
            <div className="relative w-full md:w-48 h-64 md:h-auto">
              {result.poster ? (
                <Image
                  src={result.poster}
                  alt={result.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <Play className="w-12 h-12 text-gray-600" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {result.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                    {result.year && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {result.year}
                      </span>
                    )}
                    {result.type && (
                      <span className="px-2 py-1 bg-gray-700/50 rounded">
                        {result.type}
                      </span>
                    )}
                    {result.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {result.rating}
                      </span>
                    )}
                    {result.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {result.duration}
                      </span>
                    )}
                  </div>
                  {result.description && (
                    <p className="text-gray-300 line-clamp-3 mb-4">
                      {result.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Streaming Services */}
              {result.streamingServices &&
                result.streamingServices.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">
                      Available on:
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {result.streamingServices.map((service) => (
                        <a
                          key={service.id}
                          href={service.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                          flex items-center gap-2 px-4 py-2 rounded-lg
                          bg-gradient-to-r ${
                            platformColors[service.id] ||
                            'from-gray-600 to-gray-700'
                          }
                          text-white font-medium text-sm
                          hover:shadow-lg hover:scale-105 transition-all duration-200
                        `}
                        >
                          {platformLogos[service.id] && (
                            <Image
                              src={platformLogos[service.id]}
                              alt={service.name}
                              width={20}
                              height={20}
                              className="w-5 h-5 object-contain"
                            />
                          )}
                          <span>{service.name}</span>
                          {service.price && (
                            <span className="text-xs opacity-75">
                              {service.price}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
