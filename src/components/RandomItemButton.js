'use client';

import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';

export default function RandomItemButton({ onClick, disabled }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold shadow-lg
        flex items-center gap-2 transition-all text-sm sm:text-base
        ${disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl'
        }
      `}
    >
      <motion.div
        animate={{ rotate: disabled ? 0 : [0, 360] }}
        transition={{ duration: 0.5 }}
      >
        <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.div>
      Surprise Me!
    </motion.button>
  );
}
