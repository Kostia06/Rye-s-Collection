'use client';

import { motion } from 'framer-motion';
import { Award, Trophy, Star, Heart, Sparkles, Flame, Crown, Zap } from 'lucide-react';

export default function AchievementBadge({ achievement, showAnimation = true }) {
  const iconMap = {
    collector: Award,
    curator: Trophy,
    heart_throb: Heart,
    first_item: Star,
    trending: Flame,
    milestone_10: Crown,
    milestone_50: Trophy,
    speed_demon: Zap,
  };

  const colorMap = {
    collector: 'from-blue-400 to-blue-600',
    curator: 'from-purple-400 to-purple-600',
    heart_throb: 'from-pink-400 to-red-600',
    first_item: 'from-yellow-400 to-orange-600',
    trending: 'from-orange-400 to-red-600',
    milestone_10: 'from-yellow-400 to-yellow-600',
    milestone_50: 'from-purple-400 to-pink-600',
    speed_demon: 'from-cyan-400 to-blue-600',
  };

  const Icon = iconMap[achievement.id] || Award;
  const colors = colorMap[achievement.id] || 'from-gray-400 to-gray-600';

  return (
    <motion.div
      initial={showAnimation ? { scale: 0, rotate: -180 } : { scale: 1 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="relative"
      title={achievement.description}
    >
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors} flex items-center justify-center shadow-lg relative overflow-hidden`}>
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-white/20"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <Icon className="w-8 h-8 text-white relative z-10" />
      </div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileHover={{ opacity: 1, y: -40 }}
        className="absolute left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none"
      >
        {achievement.name}
      </motion.div>
    </motion.div>
  );
}
