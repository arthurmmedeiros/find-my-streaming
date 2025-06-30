'use client';

import { FormEvent, KeyboardEvent, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBarProps {
  initialValue?: string;
  isCompact?: boolean;
}

export default function SearchBar({
  initialValue = '',
  isCompact = false,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);

  // Update local state when URL changes
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setValue(query);
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      router.push(`/?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleClear = () => {
    setValue('');
    router.push('/');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${isCompact ? 'max-w-2xl' : ''}`}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for movies, TV shows..."
          className={`
            w-full bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 border-opacity-50 
            rounded-full pl-12 pr-12 text-white placeholder-gray-400
            focus:outline-none focus:border-purple-500 focus:border-opacity-50 focus:bg-gray-800 focus:bg-opacity-70
            transition-all duration-300
            ${isCompact ? 'py-3 text-base' : 'py-4 text-lg'}
          `}
        />
        <Search
          className={`
            absolute left-4 text-gray-400 group-focus-within:text-purple-400
            transition-colors duration-200
            ${isCompact ? 'top-3.5 w-5 h-5' : 'top-5 w-6 h-6'}
          `}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className={`
              absolute right-4 text-gray-400 hover:text-white
              transition-colors duration-200
              ${isCompact ? 'top-3.5' : 'top-5'}
            `}
          >
            <X className={isCompact ? 'w-5 h-5' : 'w-6 h-6'} />
          </button>
        )}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-xl group-focus-within:blur-2xl transition-all duration-300" />
    </motion.form>
  );
}
