'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';
import CollectionGrid from '@/components/CollectionGrid';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-purple-500" />
        </motion.div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-block mb-4"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-16 h-16 text-purple-500 mx-auto" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              My Precious Collection
            </h1>
            <p className="text-gray-600 text-lg">Admin Mode - Manage your treasures</p>
          </motion.div>

          <AdminPanel items={items} onItemsChange={fetchItems} />
          <CollectionGrid items={items} loading={loading} />
        </div>
      </div>
    );
  }

  // Public view (no admin login shown unless accessing /admin)
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10"
          animate={{
            y: [0, 30, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star className="w-8 h-8 text-pink-300 opacity-50" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-10 h-10 text-purple-300 opacity-50" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4"
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star className="w-6 h-6 text-blue-300 opacity-50" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-6"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-20 h-20 text-purple-500 mx-auto filter drop-shadow-lg" />
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            My Precious Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Welcome to my little corner of treasures and memories
          </motion.p>
        </motion.div>

        {/* Collection Grid */}
        <CollectionGrid items={items} loading={loading} />
      </div>

      {/* Floating Admin Access Button */}
      <motion.a
        href="/admin"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-shadow z-50 flex items-center gap-2"
        title="Admin Access"
      >
        <Lock className="w-5 h-5" />
        <span className="hidden sm:inline font-semibold">Admin</span>
      </motion.a>
    </div>
  );
}
