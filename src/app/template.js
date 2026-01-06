'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Page transition variants - matching gallery entrance style
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.55, 0.055, 0.675, 0.19], // easeInCubic
    },
  },
};

// Slide transition for a more dynamic feel
const slideVariants = {
  initial: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
    y: direction === 'up' ? -50 : direction === 'down' ? 50 : 0,
  }),
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function Template({ children }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen"
    >
      {/* Page transition overlay */}
      <motion.div
        className="fixed inset-0 bg-[#1a1a1a] z-[9999] pointer-events-none origin-left"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.76, 0, 0.24, 1], // easeInOutQuart
        }}
      />

      {/* Secondary overlay for layered effect */}
      <motion.div
        className="fixed inset-0 bg-[#faf9f6] z-[9998] pointer-events-none origin-left"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      {children}
    </motion.div>
  );
}
