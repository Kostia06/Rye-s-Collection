'use client';

import { motion } from 'framer-motion';
import { Grid3x3, List } from 'lucide-react';

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-full p-0.5 sm:p-1 shadow-md">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('grid')}
        className={`
          p-2 sm:p-2.5 rounded-full transition-all duration-300
          ${view === 'grid'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
            : 'text-gray-600 hover:bg-gray-100'
          }
        `}
        title="Grid View"
      >
        <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('list')}
        className={`
          p-2 sm:p-2.5 rounded-full transition-all duration-300
          ${view === 'list'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
            : 'text-gray-600 hover:bg-gray-100'
          }
        `}
        title="List View"
      >
        <List className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.button>
    </div>
  );
}
