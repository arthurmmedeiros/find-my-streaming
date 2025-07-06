'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={closeMenu}
            >
              Finda.Show
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Search
            </Link>
            <Link
              href="/recommendations"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/recommendations')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              AI Recommendations
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2 border-t border-gray-200">
            <Link
              href="/"
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search Movies & TV Shows
              </div>
            </Link>
            <Link
              href="/recommendations"
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive('/recommendations')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                AI Recommendations
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
