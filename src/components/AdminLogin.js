'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Entrance animation variants matching gallery style
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
    y: direction === 'top' ? -100 : direction === 'bottom' ? 100 : 0,
    scale: 0.85,
    rotate: direction === 'left' ? -8 : direction === 'right' ? 8 : 0,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function AdminLogin() {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || '');
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] p-4 overflow-hidden">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-neutral-500 hover:text-[#1a1a1a] transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="tracking-wider uppercase text-xs">Back</span>
        </Link>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Card entering from bottom */}
        <motion.div
          custom="bottom"
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-2xl p-8 border border-neutral-100"
        >
          {/* Icon entering from top */}
          <motion.div
            custom="top"
            variants={itemVariants}
            className="flex items-center justify-center mb-8"
          >
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center">
              <Lock className="w-7 h-7 text-white" />
            </div>
          </motion.div>

          {/* Title entering from right */}
          <motion.div custom="right" variants={itemVariants}>
            <h2 className="font-serif text-4xl text-center mb-2 text-[#1a1a1a]">
              Admin
            </h2>
            <p className="text-center text-neutral-500 mb-8 text-sm tracking-wide">
              Sign in to manage your collection
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field entering from left */}
            <motion.div custom="left" variants={itemVariants}>
              <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-[#1a1a1a] focus:outline-none transition-colors text-[#1a1a1a] placeholder:text-neutral-400 bg-neutral-50"
                placeholder="admin@example.com"
                required
              />
            </motion.div>

            {/* Password field entering from right */}
            <motion.div custom="right" variants={itemVariants}>
              <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-[#1a1a1a] focus:outline-none transition-colors text-[#1a1a1a] placeholder:text-neutral-400 bg-neutral-50"
                placeholder="••••••••"
                required
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100"
              >
                {error}
              </motion.div>
            )}

            {/* Button entering from bottom */}
            <motion.div custom="bottom" variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] hover:bg-neutral-800 text-white py-3 rounded-lg font-medium shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <Lock className="w-4 h-4" />
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </motion.div>
          </form>

          {/* Decorative line */}
          <motion.div
            custom="bottom"
            variants={itemVariants}
            className="mt-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
