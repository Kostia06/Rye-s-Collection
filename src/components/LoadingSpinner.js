'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Sparkles className="w-12 h-12 text-purple-500" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-gray-600 font-medium"
      >
        {message}
      </motion.p>
    </div>
  );
}
