'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Star, Lock, Heart, Crown, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminPanel from '@/components/AdminPanel';
import CollectionGrid from '@/components/CollectionGrid';
import FloatingBackground from '@/components/FloatingBackground';
import KonamiCodeEasterEgg from '@/components/KonamiCodeEasterEgg';
import StatsModal from '@/components/StatsModal';
import ValentinePage from '@/components/ValentinePage';

// Check if today is Valentine's Day (Feb 13-14)
function isValentinesDay() {
  const now = new Date();
  return now.getMonth() === 1 && (now.getDate() === 13 || now.getDate() === 14);
}

// Component to handle legacy URL redirects
function LegacyUrlRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) {
      router.replace(`/collection/${itemId}`);
    }
  }, [searchParams, router]);

  return null;
}

// Entrance animation variants matching gallery style
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -80 : direction === 'right' ? 80 : 0,
    y: direction === 'top' ? -80 : direction === 'bottom' ? 80 : 0,
    scale: 0.85,
    rotate: direction === 'left' ? -8 : direction === 'right' ? 8 : 0,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 28,
    },
  },
};

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [isValentine, setIsValentine] = useState(false);

  // Check for Valentine's Day on mount
  useEffect(() => {
    setIsValentine(isValentinesDay());
  }, []);

  // Refs for admin functions
  const editItemRef = useRef(null);
  const deleteItemRef = useRef(null);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
    } else {
      // Batch fetch like counts for all items at once
      const itemIds = (data || []).map(item => item.id);
      let likeCounts = {};

      if (itemIds.length > 0) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('item_id')
          .in('item_id', itemIds);

        // Count likes per item
        (likeData || []).forEach(like => {
          likeCounts[like.item_id] = (likeCounts[like.item_id] || 0) + 1;
        });
      }

      const itemsWithLikes = (data || []).map(item => ({
        ...item,
        likeCount: likeCounts[item.id] || 0
      }));
      setItems(itemsWithLikes);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Valentine's Day full takeover (non-admin only)
  if (isValentine && !user && !authLoading) {
    return <ValentinePage />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f6] overflow-hidden" suppressHydrationWarning>
        <Suspense fallback={null}>
          <LegacyUrlRedirect />
        </Suspense>
        <KonamiCodeEasterEgg />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center"
        >
          {/* Loading icons entering from different directions */}
          <div className="flex items-center gap-6">
            <motion.div custom="left" variants={itemVariants}>
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
            <motion.div custom="top" variants={itemVariants}>
              <div className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Star className="w-7 h-7 text-white" />
                </motion.div>
              </div>
            </motion.div>
            <motion.div custom="right" variants={itemVariants}>
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
          <motion.p
            custom="bottom"
            variants={itemVariants}
            className="mt-8 text-sm uppercase tracking-[0.3em] text-neutral-400"
          >
            Loading
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#faf9f6]" suppressHydrationWarning>
        <Suspense fallback={null}>
          <LegacyUrlRedirect />
        </Suspense>
        <KonamiCodeEasterEgg />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl relative z-10"
        >
          {/* Header entering from top */}
          <motion.div custom="top" variants={itemVariants} className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1a1a1a]">
                My Collection
              </h1>
            </div>
            <p className="text-neutral-500 text-xs uppercase tracking-[0.2em]">Admin Mode</p>
          </motion.div>

          {/* Admin Panel entering from left */}
          <motion.div custom="left" variants={itemVariants}>
            <AdminPanel
              items={items}
              onItemsChange={fetchItems}
              onEditItem={editItemRef}
              onDeleteItem={deleteItemRef}
            />
          </motion.div>

          {/* Controls Row entering from right */}
          <motion.div
            custom="right"
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStatsModal(true)}
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full font-medium shadow-lg transition-all text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="uppercase tracking-wider text-xs">Stats</span>
            </motion.button>
          </motion.div>

          {/* Collection Grid entering from bottom */}
          <motion.div custom="bottom" variants={itemVariants}>
            <CollectionGrid
              items={items}
              loading={loading}
              isAdmin={true}
              onEdit={(item) => editItemRef.current?.(item)}
              onDelete={(id) => deleteItemRef.current?.(id)}
            />
          </motion.div>
        </motion.div>

        {/* Stats Modal */}
        <StatsModal
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
          items={items}
          achievements={[]}
        />

      </div>
    );
  }

  // Public view (no admin login shown unless accessing /admin)
  return (
    <div className="min-h-screen overflow-hidden bg-[#faf9f6]" suppressHydrationWarning>
      <Suspense fallback={null}>
        <LegacyUrlRedirect />
      </Suspense>
      <KonamiCodeEasterEgg />

      {/* Collection Grid - GSAP Gallery */}
      <CollectionGrid items={items} loading={loading} />

      {/* Floating Admin Access Button - entering from bottom right */}
      <motion.a
        href="/admin"
        initial={{ opacity: 0, x: 50, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 300, damping: 24 }}
        className="fixed bottom-6 right-6 bg-[#1a1a1a] hover:bg-neutral-800 text-white px-4 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 text-sm transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Admin Access"
      >
        <Lock className="w-4 h-4" />
        <span className="hidden sm:inline tracking-wider uppercase text-xs">Admin</span>
      </motion.a>
    </div>
  );
}
