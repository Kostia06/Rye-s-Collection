/**
 * Enhanced Home Page with GSAP Animations
 *
 * This is a complete example showing how to integrate the GSAP animation system
 * into your main page. Copy what you need from here into your actual page.js file.
 *
 * KEY FEATURES:
 * - Premium hero entrance with overlapping timelines
 * - Staggered control reveals
 * - Animated grid with scroll triggers
 * - Micro-interactions on buttons
 * - Smooth view toggle transitions
 */

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Sparkles, Star, Lock, Heart, Crown, BarChart3, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Components
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
import KonamiCodeEasterEgg from '@/components/KonamiCodeEasterEgg';
import StatsModal from '@/components/StatsModal';

// Enhanced GSAP components
import AnimatedHero from '@/components/AnimatedHero';
import AnimatedButton from '@/components/AnimatedButton';

// GSAP animations
import { useGSAP, useAnimationRefs } from '@/hooks/useGSAP';
import {
  createHeroAnimation,
  staggerFadeIn,
  loadingPulse,
  animateLayoutChange,
  DURATIONS,
} from '@/lib/animations';
import gsap from 'gsap';

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
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Refs for admin functions
  const editItemRef = useRef(null);
  const deleteItemRef = useRef(null);

  // Animation refs for hero section
  const heroHeadlineRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroDecorationsRef = useRef([]);
  const setHeroDecorationRef = (index) => (el) => {
    if (el) heroDecorationsRef.current[index] = el;
  };

  // Animation refs for controls
  const controlsContainerRef = useRef(null);
  const { refs: controlRefs, setRef: setControlRef } = useAnimationRefs();

  // Animation refs for loading
  const loadingIconRef = useRef(null);
  const emptyStateRef = useRef(null);

  // Grid container ref for layout transitions
  const gridContainerRef = useRef(null);

  // Fetch items
  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
    } else {
      const itemIds = (data || []).map(item => item.id);
      let likeCounts = {};

      if (itemIds.length > 0) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('item_id')
          .in('item_id', itemIds);

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

  // Hero animation on mount
  useGSAP(() => {
    if (authLoading || loading) return;

    createHeroAnimation({
      headline: heroHeadlineRef.current,
      subtitle: heroSubtitleRef.current,
      decorations: heroDecorationsRef.current,
    });
  }, [authLoading, loading]);

  // Controls stagger animation
  useGSAP(() => {
    if (authLoading || loading) return;
    if (controlRefs.current.length === 0) return;

    staggerFadeIn(controlRefs.current, {
      stagger: 0.08,
      y: 20,
      duration: DURATIONS.fast,
    });
  }, [authLoading, loading, controlRefs.current.length]);

  // Loading animation
  useGSAP(() => {
    if (!loading || !loadingIconRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(loadingIconRef.current, {
      rotate: 360,
      duration: 2,
      ease: 'linear',
    });

    loadingPulse(loadingIconRef.current.parentElement, {
      opacity: [1, 0.6],
      duration: 1,
    });

    return () => tl.kill();
  }, [loading]);

  // Empty state animation
  useGSAP(() => {
    if (loading || items.length > 0 || !emptyStateRef.current) return;

    gsap.fromTo(
      emptyStateRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: DURATIONS.normal, ease: 'power3.out' }
    );
  }, [loading, items.length]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(items.map(item => item.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search)
      );
    }

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

  // Animated view toggle
  const handleViewChange = (newView) => {
    if (!gridContainerRef.current) {
      setView(newView);
      return;
    }

    animateLayoutChange(gridContainerRef.current, () => {
      setView(newView);
    }, {
      duration: DURATIONS.normal,
      stagger: 0.03,
    });
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" suppressHydrationWarning>
        <KonamiCodeEasterEgg />
        <FloatingBackground />
        <div className="relative z-10 flex items-center gap-4">
          <div ref={loadingIconRef}>
            <Sparkles className="w-16 h-16 text-purple-500 fill-purple-500 drop-shadow-2xl" />
          </div>
          <Star className="w-16 h-16 text-yellow-500 fill-yellow-500 drop-shadow-2xl" />
          <Heart className="w-16 h-16 text-pink-500 fill-pink-500 drop-shadow-2xl" />
        </div>
        <p className="mt-8 text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent relative z-10">
          Loading magic...
        </p>
      </div>
    );
  }

  // Admin view
  if (user) {
    return (
      <div className="min-h-screen relative overflow-hidden" suppressHydrationWarning>
        <KonamiCodeEasterEgg />
        <FloatingBackground />
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl relative z-10">
          {/* Animated Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div ref={heroHeadlineRef} className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Sparkles
                ref={setHeroDecorationRef(0)}
                className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 fill-purple-500"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                My Collection
              </h1>
              <Sparkles
                ref={setHeroDecorationRef(1)}
                className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 fill-pink-500"
              />
            </div>
            <div ref={heroSubtitleRef} className="flex items-center justify-center gap-2">
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

          {/* Controls with stagger animation */}
          <div ref={controlsContainerRef} className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div ref={setControlRef(0)} className="flex gap-4">
              <RandomItemButton
                onClick={handleRandomItem}
                disabled={filteredItems.length === 0}
              />
              <AnimatedButton
                onClick={() => setShowStatsModal(true)}
                variant="secondary"
                className="flex items-center gap-2 text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Stats</span>
              </AnimatedButton>
            </div>
            <div ref={setControlRef(1)}>
              <ViewToggle view={view} onViewChange={handleViewChange} />
            </div>
          </div>

          <div ref={setControlRef(2)}>
            <SearchBar onSearchChange={setSearchTerm} itemCount={filteredItems.length} />
          </div>

          <div ref={setControlRef(3)}>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <div ref={setControlRef(4)}>
            <SortControl sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          <div ref={gridContainerRef}>
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

        <StatsModal
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
          items={items}
          achievements={[]}
        />
      </div>
    );
  }

  // Public view
  return (
    <div className="min-h-screen relative overflow-hidden" suppressHydrationWarning>
      <KonamiCodeEasterEgg />
      <FloatingBackground />

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-20 max-w-7xl relative z-10">
        {/* Animated Hero */}
        <AnimatedHero
          headline="My Collection"
          subtitle="A beautiful showcase of treasured collectibles"
        />

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <RandomItemButton
            onClick={handleRandomItem}
            disabled={filteredItems.length === 0}
          />
          <ViewToggle view={view} onViewChange={handleViewChange} />
        </div>

        <SearchBar onSearchChange={setSearchTerm} itemCount={filteredItems.length} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <SortControl sortBy={sortBy} onSortChange={setSortBy} />

        {/* Grid with layout transition support */}
        <div ref={gridContainerRef}>
          <CollectionGrid items={filteredItems} loading={loading} view={view} />
        </div>
      </div>

      {/* Admin Access - with magnetic effect */}
      <a href="/admin">
        <AnimatedButton
          magnetic
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex items-center gap-2 sm:gap-3 text-sm sm:text-base z-50"
        >
          <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-lg">Admin</span>
          <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 fill-yellow-300" />
        </AnimatedButton>
      </a>

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
