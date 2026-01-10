'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import StarRating from '@/components/StarRating';
import FloatingBackground from '@/components/FloatingBackground';

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

export default function ItemPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchItem();
    }
  }, [params.id]);

  const fetchItem = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', params.id)
        .single();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Item not found');
        return;
      }

      setItem(data);
      await fetchLikes();
    } catch (err) {
      console.error('Error fetching item:', err);
      setError('Item not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async () => {
    try {
      // Get total like count
      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('item_id', params.id);

      if (countError) throw countError;
      setLikeCount(count || 0);

      // Check if current user has liked
      const fingerprint = getUserFingerprint();
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('item_id', params.id)
        .eq('user_fingerprint', fingerprint)
        .single();

      setIsLiked(!!data);
    } catch (error) {
      console.log('Like fetch info:', error.message);
    }
  };

  const toggleLike = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const fingerprint = getUserFingerprint();

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('item_id', params.id)
          .eq('user_fingerprint', fingerprint);

        if (error) throw error;
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ item_id: params.id, user_fingerprint: fingerprint }]);

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

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-neutral-400" />
        </motion.div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f6] px-4">
        <h1 className="font-serif text-3xl text-[#1a1a1a] mb-4">Item Not Found</h1>
        <p className="text-neutral-500 mb-8">The item you're looking for doesn't exist.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]" suppressHydrationWarning>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f6]/80 backdrop-blur-md border-b border-neutral-100"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[#1a1a1a] hover:text-neutral-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">Back</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5 text-neutral-600" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLike}
              className="flex items-center gap-2 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isLiked ? 'text-red-500 fill-red-500' : 'text-neutral-600'
                }`}
              />
              {likeCount > 0 && (
                <span className="text-sm font-medium text-neutral-600">{likeCount}</span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 mb-8"
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-neutral-300" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] mb-4">
              {item.title}
            </h1>

            {item.category && (
              <span className="inline-block px-4 py-1.5 bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wider rounded-full mb-6">
                {item.category}
              </span>
            )}

            {/* Star Rating */}
            <div className="mb-6">
              <StarRating itemId={item.id} initialRating={item.rating || 0} />
            </div>

            {item.description && (
              <p className="text-neutral-600 text-lg leading-relaxed mb-8">
                {item.description}
              </p>
            )}

            {/* Stats */}
            <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-sm text-neutral-400 uppercase tracking-wider">
                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
              </span>
              <span className="text-sm text-neutral-400">
                Added {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
