'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import AchievementBadge from './AchievementBadge';

export default function AchievementToast({ achievements = [] }) {
  return (
    <AnimatePresence>
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: -20, x: 400 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            delay: index * 0.1,
          }}
          className="fixed top-6 right-6 z-50 pointer-events-none"
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-4 border-2 border-gradient-to-r from-purple-300 to-pink-300 flex items-center gap-4 min-w-80"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <AchievementBadge achievement={achievement} showAnimation={true} />

            <div className="flex-1">
              <p className="font-bold text-gray-800">🎉 Achievement Unlocked!</p>
              <p className="text-sm text-gray-600">{achievement.name}</p>
            </div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-2xl"
            >
              ✨
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
