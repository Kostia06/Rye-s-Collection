'use client';

import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, Flower2, Gift, Crown, Gem, Music, Cake, Coffee, Smile, Sun, Moon, Cloud, Zap, Feather, Leaf, Apple, Cherry, Candy, IceCream, Pizza, Cookie, Donut } from 'lucide-react';

export default function FloatingBackground() {
  // Array of cute icons with colors - LOTS MORE!
  const iconTypes = [
    { Icon: Heart, color: 'text-pink-400', fill: 'fill-pink-400' },
    { Icon: Star, color: 'text-yellow-400', fill: 'fill-yellow-400' },
    { Icon: Sparkles, color: 'text-purple-400', fill: 'fill-purple-400' },
    { Icon: Flower2, color: 'text-pink-500', fill: 'fill-pink-500' },
    { Icon: Gift, color: 'text-orange-400', fill: 'fill-orange-400' },
    { Icon: Crown, color: 'text-yellow-500', fill: 'fill-yellow-500' },
    { Icon: Gem, color: 'text-cyan-400', fill: 'fill-cyan-400' },
    { Icon: Music, color: 'text-purple-500', fill: 'fill-purple-500' },
    { Icon: Cake, color: 'text-pink-400', fill: 'fill-pink-400' },
    { Icon: Coffee, color: 'text-amber-600', fill: 'fill-amber-600' },
    { Icon: Smile, color: 'text-yellow-400', fill: 'fill-yellow-400' },
    { Icon: Sun, color: 'text-orange-400', fill: 'fill-orange-400' },
    { Icon: Moon, color: 'text-indigo-400', fill: 'fill-indigo-400' },
    { Icon: Cloud, color: 'text-blue-300', fill: 'fill-blue-300' },
    { Icon: Zap, color: 'text-yellow-500', fill: 'fill-yellow-500' },
    { Icon: Feather, color: 'text-cyan-300', fill: 'fill-cyan-300' },
    { Icon: Leaf, color: 'text-green-400', fill: 'fill-green-400' },
    { Icon: Apple, color: 'text-red-400', fill: 'fill-red-400' },
    { Icon: Cherry, color: 'text-red-500', fill: 'fill-red-500' },
  ];

  // Generate 40 floating elements!
  const floatingElements = Array.from({ length: 40 }, (_, index) => {
    const iconData = iconTypes[index % iconTypes.length];
    const sizes = ['w-8 h-8', 'w-10 h-10', 'w-12 h-12', 'w-6 h-6'];
    const size = sizes[index % sizes.length];

    return {
      ...iconData,
      size,
      delay: (index * 0.5) % 10,
      left: `${(index * 7) % 100}%`,
      startY: `${100 + (index * 5) % 50}%`,
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

      {/* Main floating icons - MORE VISIBLE! */}
      {floatingElements.map((element, index) => {
        const { Icon, color, fill, size, delay, left, startY } = element;

        return (
          <motion.div
            key={`float-${index}`}
            className={`absolute ${color} ${size} opacity-70 drop-shadow-lg`}
            style={{ left, top: startY }}
            animate={{
              y: [0, -400, -800, -1200],
              x: [0, Math.sin(index) * 50, Math.cos(index) * 50, 0],
              opacity: [0, 0.7, 0.8, 0.5, 0],
              rotate: [0, 180, 360, 540],
              scale: [0.5, 1, 1.2, 1, 0.5],
            }}
            transition={{
              duration: 20 + (index % 10),
              repeat: Infinity,
              delay: delay,
              ease: 'linear',
            }}
          >
            <Icon className={`w-full h-full ${fill}`} />
          </motion.div>
        );
      })}

      {/* Extra sparkles layer - MORE VISIBLE */}
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={`sparkle-${index}`}
          className="absolute text-yellow-400 opacity-80 drop-shadow-md"
          style={{
            left: `${(index * 5) % 100}%`,
            top: `${100 + (index * 10) % 50}%`,
          }}
          animate={{
            y: [0, -300, -600],
            scale: [0, 1.5, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 8 + index * 0.5,
            repeat: Infinity,
            delay: index * 0.4,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-6 h-6 fill-yellow-400" />
        </motion.div>
      ))}

      {/* Rotating hearts layer */}
      {[...Array(15)].map((_, index) => (
        <motion.div
          key={`heart-${index}`}
          className="absolute text-pink-400 opacity-75 drop-shadow-lg"
          style={{
            left: `${(index * 6.67) % 100}%`,
            top: `${110 + (index * 8) % 40}%`,
          }}
          animate={{
            y: [0, -500, -1000],
            rotate: [0, 360, 720],
            scale: [0.8, 1.3, 0.8],
            opacity: [0, 0.75, 0],
          }}
          transition={{
            duration: 18 + index,
            repeat: Infinity,
            delay: index * 0.6,
            ease: 'easeInOut',
          }}
        >
          <Heart className="w-8 h-8 fill-pink-400" />
        </motion.div>
      ))}

      {/* Star burst layer */}
      {[...Array(12)].map((_, index) => (
        <motion.div
          key={`star-${index}`}
          className="absolute text-yellow-500 opacity-80 drop-shadow-xl"
          style={{
            left: `${(index * 8.33) % 100}%`,
            top: `${105 + (index * 7) % 45}%`,
          }}
          animate={{
            y: [0, -350, -700],
            rotate: [0, -360, -720],
            scale: [0.5, 1.4, 0.5],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 15 + index * 0.8,
            repeat: Infinity,
            delay: index * 0.5,
            ease: 'easeInOut',
          }}
        >
          <Star className="w-10 h-10 fill-yellow-500" />
        </motion.div>
      ))}
    </div>
  );
}
