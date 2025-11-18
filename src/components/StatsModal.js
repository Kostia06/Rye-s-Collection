'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, TrendingUp, Heart, Star, Trophy } from 'lucide-react';
import AchievementBadge from './AchievementBadge';

export default function StatsModal({ isOpen, onClose, items = [], achievements = [] }) {
  const stats = {
    totalItems: items.length,
    totalLikes: items.reduce((sum, item) => sum + (item.likeCount || 0), 0),
    averageLikes: items.length > 0 ? Math.round(items.reduce((sum, item) => sum + (item.likeCount || 0), 0) / items.length * 10) / 10 : 0,
    categories: new Set(items.map(item => item.category).filter(Boolean)).size,
    mostLiked: items.length > 0 ? items.reduce((max, item) => (item.likeCount || 0) > (max.likeCount || 0) ? item : max) : null,
    described: items.filter(item => item.description?.trim()).length,
  };

  const statCards = [
    { label: 'Total Items', value: stats.totalItems, icon: Trophy, color: 'from-purple-400 to-purple-600' },
    { label: 'Total Likes', value: stats.totalLikes, icon: Heart, color: 'from-pink-400 to-red-600' },
    { label: 'Avg Likes/Item', value: stats.averageLikes, icon: TrendingUp, color: 'from-blue-400 to-blue-600' },
    { label: 'Categories', value: stats.categories, icon: BarChart3, color: 'from-yellow-400 to-orange-600' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Collection Stats
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ rotate: 90 }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${card.color} rounded-xl p-4 text-white shadow-lg`}
                  >
                    <Icon className="w-6 h-6 mb-2 opacity-80" />
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-xs opacity-90">{card.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Most Liked Item */}
            {stats.mostLiked && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-8 border-2 border-pink-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-800">🔥 Most Popular Item</h3>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-1">{stats.mostLiked.title}</p>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                  <span className="text-sm text-gray-600">{stats.mostLiked.likeCount || 0} likes</span>
                </div>
              </motion.div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Achievements Unlocked ({achievements.length})
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                  {achievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      showAnimation={false}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {achievements.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-500"
              >
                <p className="mb-2">Keep building your collection to unlock achievements! 🚀</p>
                <p className="text-sm">Add more items, get likes, and organize your collection.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Import Flame icon
import { Flame } from 'lucide-react';
