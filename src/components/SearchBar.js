'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';

export default function SearchBar({ onSearchChange, itemCount }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearchChange('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8"
    >
      <div className="max-w-2xl mx-auto px-2 sm:px-0">
        <div className="relative">
          {/* Search icon */}
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>

          {/* Input field */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search your collection..."
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 rounded-full border-2 border-white/50 focus:border-white focus:outline-none transition-all bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg focus:shadow-lg text-sm sm:text-base text-gray-900 placeholder:text-gray-500"
          />

          {/* Clear button */}
          {searchTerm && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
            </motion.button>
          )}
        </div>

        {/* Result count */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center text-sm sm:text-base text-gray-700 font-medium flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-600 fill-purple-600" />
            <span>
              Found <span className="font-bold text-purple-700">{itemCount}</span> treasure{itemCount !== 1 ? 's' : ''}
            </span>
            <Sparkles className="w-4 h-4 text-purple-600 fill-purple-600" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
