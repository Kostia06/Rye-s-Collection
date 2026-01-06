'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ChevronDown } from 'lucide-react';
import StarRating from './StarRating';

export default function ItemPreviewModal({ item, isOpen, onClose, likeCount, isLiked, onToggleLike }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-end md:items-center justify-center z-[200]"
        >
          <motion.div
            initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-[#faf9f6] w-full max-h-[90vh] overflow-y-auto relative ${
              isMobile
                ? 'rounded-t-3xl'
                : 'rounded-2xl max-w-3xl mx-4'
            }`}
          >
            {/* Mobile drag indicator */}
            {isMobile && (
              <div className="sticky top-0 z-20 bg-[#faf9f6] pt-3 pb-2">
                <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto" />
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute z-20 w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center active:scale-90 transition-transform ${
                isMobile ? 'top-4 right-4' : 'top-4 right-4'
              }`}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className={`${isMobile ? 'px-4 pb-8' : 'p-6'}`}>
              {/* Image */}
              <div className={`relative overflow-hidden bg-neutral-100 ${
                isMobile ? 'aspect-square rounded-2xl' : 'aspect-[4/3] rounded-xl'
              }`}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                    <span className="text-neutral-300 font-serif text-4xl">No Image</span>
                  </div>
                )}

                {/* Like button overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike?.(e);
                  }}
                  className={`absolute w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform ${
                    isMobile ? 'bottom-4 right-4' : 'top-4 right-4'
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      isLiked ? 'text-red-500 fill-red-500' : 'text-neutral-400'
                    }`}
                  />
                  {likeCount > 0 && (
                    <span className="absolute -bottom-1 -right-1 bg-[#1a1a1a] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      {likeCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="mt-6">
                <h2 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] leading-tight">
                  {item.title}
                </h2>

                {item.category && (
                  <span className="inline-block mt-3 px-3 py-1 bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wider rounded-full">
                    {item.category}
                  </span>
                )}

                {/* Star Rating */}
                <div className="mt-4">
                  <StarRating itemId={item.id} initialRating={item.rating || 0} />
                </div>

                {/* Description */}
                {item.description && (
                  <div className="mt-6">
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">
                    {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                  </span>
                </div>
              </div>
            </div>

            {/* Safe area padding for phones with notch */}
            {isMobile && <div className="h-safe" />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
