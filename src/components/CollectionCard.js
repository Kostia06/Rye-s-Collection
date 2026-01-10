'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Edit2, Trash2, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ItemPreviewModal from './ItemPreviewModal';
import CardTilt from './CardTilt';

// Generate a simple browser fingerprint for anonymous likes
const getUserFingerprint = () => {
  if (typeof window === 'undefined') return 'server';

  let fingerprint = localStorage.getItem('user_fingerprint');
  if (!fingerprint) {
    fingerprint = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_fingerprint', fingerprint);
  }
  return fingerprint;
};

export default function CollectionCard({ item, index, isAdmin, onEdit, onDelete }) {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    fetchLikes();
  }, [item.id]);

  const fetchLikes = async () => {
    try {
      // Get total like count
      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('item_id', item.id);

      if (countError) throw countError;
      setLikeCount(count || 0);

      // Check if current user has liked
      const fingerprint = getUserFingerprint();
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('item_id', item.id)
        .eq('user_fingerprint', fingerprint)
        .single();

      setIsLiked(!!data);
    } catch (error) {
      // Silently handle errors (user might not have liked yet)
      console.log('Like fetch info:', error.message);
    }
  };

  const toggleLike = async (e) => {
    e.stopPropagation();

    if (isAnimating) return;
    setIsAnimating(true);

    const fingerprint = getUserFingerprint();

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('item_id', item.id)
          .eq('user_fingerprint', fingerprint);

        if (error) throw error;
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert([{ item_id: item.id, user_fingerprint: fingerprint }]);

        if (error) throw error;
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/collection/${item.id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleDoubleClick = async (e) => {
    const now = Date.now();
    if (now - lastClickTime < 300 && !isLiked) {
      // Double click detected and not already liked - trigger like!
      toggleLike(e);
    }
    setLastClickTime(now);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="group relative cursor-pointer"
        onClick={() => {
          handleDoubleClick({ stopPropagation: () => {} });
          setShowPreview(true);
        }}
      >
        <CardTilt>
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-pink-200">
        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-3 left-3 z-20 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
          {item.image_url ? (
            <motion.img
              src={item.image_url}
              alt={item.title}
              loading="lazy"
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
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors flex-1">
              {item.title}
            </h3>

            <div className="flex items-center gap-2">
              {/* Share Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </motion.button>

              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLike}
                className="flex flex-col items-center gap-1 cursor-pointer relative"
              >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isLiked
                      ? 'text-pink-500 fill-pink-500'
                      : 'text-pink-400 fill-pink-100 hover:fill-pink-200'
                  }`}
                />
              </motion.div>
              {likeCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs font-bold text-pink-600"
                >
                  {likeCount}
                </motion.span>
              )}

              </motion.button>
            </div>
          </div>

          {item.category && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 text-purple-700 text-xs font-bold rounded-full mb-3 shadow-sm"
            >
              <Sparkles className="w-3 h-3" />
              {item.category}
            </motion.span>
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
        </CardTilt>
      </motion.div>

      {/* Preview Modal */}
      <ItemPreviewModal
        item={item}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        likeCount={likeCount}
        isLiked={isLiked}
        onToggleLike={toggleLike}
      />
    </>
  );
}
