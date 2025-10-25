'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export default function CollectionCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
          {item.image_url ? (
            <motion.img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-purple-300" />
            </div>
          )}

          {/* Floating sparkles effect */}
          <motion.div
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400 filter drop-shadow-lg" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
              {item.title}
            </h3>
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="w-6 h-6 text-pink-400 fill-pink-200" />
            </motion.div>
          </div>

          {item.category && (
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold rounded-full mb-3">
              {item.category}
            </span>
          )}

          {item.description && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Decorative bottom border */}
          <motion.div
            className="mt-4 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Animated glow effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10" />
    </motion.div>
  );
}
