'use client';

import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, Flower2, Gift, Crown, Gem, Music, Cake, Coffee, Smile, Sun, Moon, Cloud, Zap, Feather, Leaf, Apple, Cherry, Candy, IceCream, Pizza, Cookie, Donut } from 'lucide-react';
import SafeIcon from './SafeIcon';

export default function FloatingBackground() {
  // Array of cute icons with colors - optimized for performance
  const iconTypes = [
    { Icon: Heart, color: 'text-pink-400', fill: 'fill-pink-400' },
    { Icon: Star, color: 'text-yellow-400', fill: 'fill-yellow-400' },
    { Icon: Sparkles, color: 'text-purple-400', fill: 'fill-purple-400' },
    { Icon: Gem, color: 'text-cyan-400', fill: 'fill-cyan-400' },
    { Icon: Gift, color: 'text-orange-400', fill: 'fill-orange-400' },
    { Icon: Crown, color: 'text-yellow-500', fill: 'fill-yellow-500' },
  ];

  // Generate floating elements - use fixed 12 for consistent hydration
  const elementCount = 12;
  const floatingElements = Array.from({ length: elementCount }, (_, index) => {
    const iconData = iconTypes[index % iconTypes.length];
    const sizes = ['w-8 h-8', 'w-10 h-10', 'w-12 h-12'];
    const size = sizes[index % sizes.length];

    return {
      ...iconData,
      size,
      delay: (index * 1) % 8,
      left: `${(index * 8.33) % 100}%`,
      startY: `${100 + (index * 3) % 30}%`,
    };
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"
        animate={{
          background: [
            'linear-gradient(to bottom right, rgb(252, 231, 243), rgb(243, 232, 255), rgb(219, 234, 254))',
            'linear-gradient(to bottom right, rgb(243, 232, 255), rgb(219, 234, 254), rgb(254, 249, 195))',
            'linear-gradient(to bottom right, rgb(219, 234, 254), rgb(254, 249, 195), rgb(252, 231, 243))',
            'linear-gradient(to bottom right, rgb(254, 249, 195), rgb(252, 231, 243), rgb(243, 232, 255))',
            'linear-gradient(to bottom right, rgb(252, 231, 243), rgb(243, 232, 255), rgb(219, 234, 254))',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Main floating icons - simplified animations */}
      {floatingElements.map((element, index) => {
        const { Icon, color, fill, size, delay, left, startY } = element;

        return (
          <motion.div
            key={`float-${index}`}
            className={`absolute ${color} ${size} opacity-60`}
            style={{ left, top: startY }}
            animate={{
              y: [0, -600],
              opacity: [0, 0.6, 0.5, 0],
            }}
            transition={{
              duration: 25 + (index % 5),
              repeat: Infinity,
              delay: delay,
              ease: 'easeInOut',
            }}
            suppressHydrationWarning
          >
            <SafeIcon>
              <Icon className={`w-full h-full ${fill}`} />
            </SafeIcon>
          </motion.div>
        );
      })}
    </div>
  );
}
