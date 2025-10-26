'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Lock, Heart, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';
import CollectionGrid from '@/components/CollectionGrid';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import SortControl from '@/components/SortControl';
import ViewToggle from '@/components/ViewToggle';
import RandomItemButton from '@/components/RandomItemButton';
import ItemPreviewModal from '@/components/ItemPreviewModal';
import FloatingBackground from '@/components/FloatingBackground';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState('grid');
  const [randomItem, setRandomItem] = useState(null);
  const [showRandomPreview, setShowRandomPreview] = useState(false);

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
      // Fetch like counts for each item
      const itemsWithLikes = await Promise.all(
        (data || []).map(async (item) => {
          const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('item_id', item.id);
          return { ...item, likeCount: count || 0 };
        })
      );
      setItems(itemsWithLikes);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(items.map(item => item.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'mostLiked':
        sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return sorted;
  }, [items, searchTerm, selectedCategory, sortBy]);

  // Random item picker
  const handleRandomItem = () => {
    if (filteredItems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    setRandomItem(filteredItems[randomIndex]);
    setShowRandomPreview(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <FloatingBackground />
        <div className="relative z-10 flex items-center gap-4">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
          >
            <Sparkles className="w-16 h-16 text-purple-500 fill-purple-500 drop-shadow-2xl" />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Star className="w-16 h-16 text-yellow-500 fill-yellow-500 drop-shadow-2xl" />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Heart className="w-16 h-16 text-pink-500 fill-pink-500 drop-shadow-2xl" />
          </motion.div>
        </div>
        <motion.p
          className="mt-8 text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent relative z-10"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading magic...
        </motion.p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <FloatingBackground />
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl relative z-10">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 fill-purple-500" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                My Collection
              </h1>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 fill-pink-500" />
            </motion.div>
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
              <p className="text-purple-600 text-xs sm:text-sm font-semibold">Admin Mode</p>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
            </div>
          </div>

          <AdminPanel
            items={items}
            onItemsChange={fetchItems}
            onEditItem={editItemRef}
            onDeleteItem={deleteItemRef}
          />

          {/* Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <RandomItemButton
              onClick={handleRandomItem}
              disabled={filteredItems.length === 0}
            />
            <ViewToggle view={view} onViewChange={setView} />
          </div>

          {/* Search Bar */}
          <SearchBar onSearchChange={setSearchTerm} itemCount={filteredItems.length} />

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Sort Control */}
          <SortControl sortBy={sortBy} onSortChange={setSortBy} />

          <CollectionGrid
            items={filteredItems}
            loading={loading}
            isAdmin={true}
            onEdit={(item) => editItemRef.current?.(item)}
            onDelete={(id) => deleteItemRef.current?.(id)}
            view={view}
          />
        </div>
      </div>
    );
  }

  // Public view (no admin login shown unless accessing /admin)
  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingBackground />

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-20 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-500 fill-purple-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              My Collection
            </h1>
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-pink-500 fill-pink-500" />
          </motion.div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <RandomItemButton
            onClick={handleRandomItem}
            disabled={filteredItems.length === 0}
          />
          <ViewToggle view={view} onViewChange={setView} />
        </div>

        {/* Search Bar */}
        <SearchBar onSearchChange={setSearchTerm} itemCount={filteredItems.length} />

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Sort Control */}
        <SortControl sortBy={sortBy} onSortChange={setSortBy} />

        {/* Collection Grid */}
        <CollectionGrid items={filteredItems} loading={loading} view={view} />
      </div>

      {/* Floating Admin Access Button */}
      <motion.a
        href="/admin"
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-full shadow-lg z-50 flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-base transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Admin Access"
      >
        <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-base sm:text-lg">Admin</span>
        <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 fill-yellow-300" />
      </motion.a>

      {/* Random Item Preview Modal */}
      {randomItem && (
        <ItemPreviewModal
          item={randomItem}
          isOpen={showRandomPreview}
          onClose={() => setShowRandomPreview(false)}
          likeCount={randomItem.likeCount || 0}
          isLiked={false}
          onToggleLike={() => {}}
        />
      )}
    </div>
  );
}
