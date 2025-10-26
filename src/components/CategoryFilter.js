'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  if (categories.length === 0) return null;

  const allCategories = ['All', ...categories];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 sm:mb-6 px-2 sm:px-0"
    >
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {allCategories.map((category, index) => {
          const isSelected = category === selectedCategory;

          return (
            <motion.button
              key={category}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category)}
              className={`
                relative px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm
                transition-all duration-300 shadow-md hover:shadow-lg
                ${isSelected
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                }
              `}
            >
              <span className="flex items-center gap-1 sm:gap-1.5">
                {isSelected && <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />}
                {category}
              </span>

              {/* Glow effect for selected */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-lg -z-10"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
