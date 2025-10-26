'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Star, Crown, Gift } from 'lucide-react';

export default function ItemPreviewModal({ item, isOpen, onClose, likeCount, isLiked, onToggleLike }) {
  if (!item) return null;

  // Check if mobile for animation optimization
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 z-50"
        >
          {/* Floating decorative icons around modal - Hidden on mobile */}
          <motion.div
            className="absolute top-10 left-10 text-pink-400 hidden sm:block"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart className="w-8 h-8 fill-pink-400 opacity-60" />
          </motion.div>
          <motion.div
            className="absolute top-20 right-16 text-yellow-400 hidden md:block"
            animate={{
              y: [0, -15, 0],
              rotate: [0, -360],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
          >
            <Star className="w-10 h-10 fill-yellow-400 opacity-60" />
          </motion.div>
          <motion.div
            className="absolute bottom-16 left-20 text-purple-400 hidden sm:block"
            animate={{
              y: [0, -25, 0],
              rotate: [0, 360],
              scale: [1, 1.4, 1],
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
          >
            <Sparkles className="w-9 h-9 fill-purple-400 opacity-60" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-12 text-cyan-400 hidden md:block"
            animate={{
              y: [0, -18, 0],
              rotate: [0, 360],
              scale: [1, 1.25, 1],
            }}
            transition={{ duration: 2.8, repeat: Infinity, delay: 1.5, ease: 'easeInOut' }}
          >
            <Gift className="w-8 h-8 fill-cyan-400 opacity-60" />
          </motion.div>

          <motion.div
            initial={isMobile ? { opacity: 0 } : { scale: 0.5, rotate: -10, opacity: 0 }}
            animate={isMobile ? { opacity: 1 } : { scale: 1, rotate: 0, opacity: 1 }}
            exit={isMobile ? { opacity: 0 } : { scale: 0.5, rotate: 10, opacity: 0 }}
            transition={isMobile ? { duration: 0.2 } : { type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            {/* Decorative gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 p-[3px] pointer-events-none">
              <div className="w-full h-full bg-white rounded-3xl" />
            </div>

            {/* Close button - More interactive! */}
            <motion.button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-lg z-20"
              whileHover={isMobile ? {} : { scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.button>

            {/* Floating sparkles inside modal - Hidden on mobile for performance */}
            <motion.div
              className="absolute top-10 left-10 text-yellow-400 pointer-events-none hidden md:block"
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
            >
              <Sparkles className="w-4 h-4 fill-yellow-400" />
            </motion.div>
            <motion.div
              className="absolute top-16 right-14 text-pink-400 pointer-events-none hidden md:block"
              animate={{
                scale: [0, 1, 0],
                rotate: [0, -180, -360],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
            >
              <Sparkles className="w-5 h-5 fill-pink-400" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 relative z-10">
              {/* Image side */}
              <div className="relative">
                <motion.div
                  className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-xl"
                  layoutId={`image-${item.id}`}
                  whileHover={isMobile ? {} : { scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-purple-400 fill-purple-400" />
                      </motion.div>
                    </div>
                  )}

                  {/* Corner decorations - Hidden on mobile for performance */}
                  <motion.div
                    className="absolute top-2 left-2 text-yellow-400 hidden sm:block"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 opacity-80" />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-2 right-2 text-pink-400 hidden sm:block"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-pink-400 opacity-80" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Content side */}
              <div className="flex flex-col">
                {/* Title */}
                <motion.h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4"
                  initial={isMobile ? {} : { x: -20, opacity: 0 }}
                  animate={isMobile ? {} : { x: 0, opacity: 1 }}
                  transition={isMobile ? {} : { delay: 0.2 }}
                >
                  {item.title}
                </motion.h2>

                {/* Category */}
                {item.category && (
                  <motion.div
                    className="mb-4 sm:mb-6"
                    initial={isMobile ? {} : { x: -20, opacity: 0 }}
                    animate={isMobile ? {} : { x: 0, opacity: 1 }}
                    transition={isMobile ? {} : { delay: 0.3 }}
                  >
                    <motion.span
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 text-purple-700 text-sm font-bold rounded-full shadow-md"
                      whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Crown className="w-4 h-4 fill-purple-600" />
                      </motion.div>
                      {item.category}
                    </motion.span>
                  </motion.div>
                )}

                {/* Description */}
                {item.description && (
                  <motion.div
                    className="flex-1"
                    initial={isMobile ? {} : { y: 20, opacity: 0 }}
                    animate={isMobile ? {} : { y: 0, opacity: 1 }}
                    transition={isMobile ? {} : { delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-purple-500 fill-purple-500" />
                      <h3 className="text-base sm:text-lg font-bold text-gray-700">
                        About this treasure
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                )}

                {/* Decorative bottom border with animation */}
                <motion.div
                  className="mt-6 h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full relative overflow-hidden"
                  initial={isMobile ? {} : { scaleX: 0 }}
                  animate={isMobile ? {} : { scaleX: 1 }}
                  transition={isMobile ? {} : { duration: 0.5, delay: 0.5, ease: 'easeInOut' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Floating Like Button - Bottom Right */}
            <motion.div
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10"
              initial={isMobile ? {} : { scale: 0 }}
              animate={isMobile ? {} : { scale: 1 }}
              transition={isMobile ? {} : { delay: 0.3, type: 'spring' }}
            >
              <motion.button
                whileHover={isMobile ? {} : { scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleLike}
                className="flex flex-col items-center gap-1 relative bg-white rounded-full p-3 shadow-2xl"
              >
                <motion.div
                  animate={isLiked ? {
                    scale: [1, 1.3, 1],
                  } : {}}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Heart
                    className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                      isLiked
                        ? 'text-pink-500 fill-pink-500'
                        : 'text-pink-400 fill-pink-100 hover:fill-pink-200'
                    }`}
                  />
                </motion.div>
                {likeCount > 0 && (
                  <motion.span
                    className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    {likeCount}
                  </motion.span>
                )}
                {/* Sparkle on liked */}
                {isLiked && (
                  <motion.div
                    className="absolute -top-2 -right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 0], rotate: [0, 180, 360] }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
