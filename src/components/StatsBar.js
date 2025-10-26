'use client';

import { motion } from 'framer-motion';
import { Package, Heart, Sparkles } from 'lucide-react';

export default function StatsBar({ totalItems, totalLikes }) {
  const stats = [
    { icon: Package, label: 'Treasures', value: totalItems, color: 'from-purple-500 to-purple-600' },
    { icon: Heart, label: 'Total Likes', value: totalLikes, color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap justify-center gap-2 mb-4"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            className={`
              bg-gradient-to-r ${stat.color}
              text-white px-3 py-1.5 rounded-lg shadow-md
              flex items-center gap-2 min-w-[100px]
            `}
          >
            <div className="bg-white/20 p-1 rounded-lg">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-[10px] font-medium opacity-90">{stat.label}</div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
