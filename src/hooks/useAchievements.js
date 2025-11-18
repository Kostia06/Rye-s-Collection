import { useState, useEffect, useCallback } from 'react';

const ACHIEVEMENTS = {
  first_item: {
    id: 'first_item',
    name: '🌟 First Treasure',
    description: 'Added your first item',
    condition: (items) => items.length === 1,
  },
  collector_5: {
    id: 'collector_5',
    name: '🎯 Collector',
    description: 'Collected 5 items',
    condition: (items) => items.length >= 5,
  },
  collector_25: {
    id: 'collector_25',
    name: '🏆 Grand Collector',
    description: 'Collected 25 items',
    condition: (items) => items.length >= 25,
  },
  curator: {
    id: 'curator',
    name: '🎨 Curator',
    description: 'All items have descriptions',
    condition: (items) => items.length > 0 && items.every(item => item.description?.trim()),
  },
  well_loved: {
    id: 'well_loved',
    name: '💖 Well Loved',
    description: 'Total 50+ likes across collection',
    condition: (items, stats) => (stats?.totalLikes || 0) >= 50,
  },
  trending: {
    id: 'trending',
    name: '🔥 Trending',
    description: 'One item has 10+ likes',
    condition: (items) => items.some(item => (item.likeCount || 0) >= 10),
  },
  organized: {
    id: 'organized',
    name: '📂 Organized',
    description: 'All items categorized',
    condition: (items) => items.length > 0 && items.every(item => item.category?.trim()),
  },
  variety: {
    id: 'variety',
    name: '🌈 Variety Pack',
    description: '5+ different categories',
    condition: (items) => {
      const categories = new Set(items.map(item => item.category).filter(Boolean));
      return categories.size >= 5;
    },
  },
};

export function useAchievements(items = []) {
  const [achievements, setAchievements] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);

  const getStats = useCallback(() => {
    return {
      totalLikes: items.reduce((sum, item) => sum + (item.likeCount || 0), 0),
      totalItems: items.length,
      categorizedItems: items.filter(item => item.category?.trim()).length,
      describedItems: items.filter(item => item.description?.trim()).length,
    };
  }, [items]);

  useEffect(() => {
    const stats = getStats();
    const earned = Object.values(ACHIEVEMENTS).filter(achievement =>
      achievement.condition(items, stats)
    );

    const previousIds = new Set(achievements.map(a => a.id));
    const newIds = earned.filter(a => !previousIds.has(a.id));

    if (newIds.length > 0) {
      setNewAchievements(newIds);
      setTimeout(() => setNewAchievements([]), 5000);
    }

    setAchievements(earned);
  }, [items, achievements, getStats]);

  return { achievements, newAchievements };
}
