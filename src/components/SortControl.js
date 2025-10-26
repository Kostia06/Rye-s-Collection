'use client';

import { motion } from 'framer-motion';
import { ArrowUpDown, TrendingUp, Clock, ArrowDownAZ } from 'lucide-react';

export default function SortControl({ sortBy, onSortChange }) {
  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Clock },
    { value: 'oldest', label: 'Oldest First', icon: Clock },
    { value: 'mostLiked', label: 'Most Liked', icon: TrendingUp },
    { value: 'alphabetical', label: 'A-Z', icon: ArrowDownAZ },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center mb-4 sm:mb-6 px-2 sm:px-0">
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
        <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Sort:</span>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = sortBy === option.value;

          return (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSortChange(option.value)}
              className={`
                px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm
                transition-all duration-300 shadow-md
                flex items-center gap-1 sm:gap-1.5
                ${isSelected
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
