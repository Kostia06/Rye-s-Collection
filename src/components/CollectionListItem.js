'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Edit2, Trash2, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ItemPreviewModal from './ItemPreviewModal';

const getUserFingerprint = () => {
  if (typeof window === 'undefined') return 'server';
  let fingerprint = localStorage.getItem('user_fingerprint');
  if (!fingerprint) {
    fingerprint = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_fingerprint', fingerprint);
  }
  return fingerprint;
};

export default function CollectionListItem({ item, index, isAdmin, onEdit, onDelete }) {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchLikes();
  }, [item.id]);

  const fetchLikes = async () => {
    try {
      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('item_id', item.id);

      if (countError) throw countError;
      setLikeCount(count || 0);

      const fingerprint = getUserFingerprint();
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('item_id', item.id)
        .eq('user_fingerprint', fingerprint)
        .single();

      setIsLiked(!!data);
    } catch (error) {
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
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('item_id', item.id)
          .eq('user_fingerprint', fingerprint);
        if (error) throw error;
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
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
    const url = `${window.location.origin}?item=${item.id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard! 🔗');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-pink-200"
        onClick={() => setShowPreview(true)}
      >
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-300" />
              </div>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <div className="absolute top-2 left-2 flex gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="p-1.5 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-800 truncate">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                </motion.button>

                {/* Like Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleLike}
                  className="flex flex-col items-center gap-0.5"
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      isLiked
                        ? 'text-pink-500 fill-pink-500'
                        : 'text-pink-400 fill-pink-100 hover:fill-pink-200'
                    }`}
                  />
                  {likeCount > 0 && (
                    <span className="text-xs font-bold text-pink-600">
                      {likeCount}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            {item.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 text-purple-700 text-xs font-bold rounded-full mb-2">
                <Sparkles className="w-3 h-3" />
                {item.category}
              </span>
            )}

            {item.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                {item.description}
              </p>
            )}
          </div>
        </div>
      </motion.div>

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
