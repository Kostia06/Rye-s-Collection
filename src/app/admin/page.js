'use client';

import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from '@/components/AdminLogin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

// Loading animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
    y: direction === 'top' ? -60 : direction === 'bottom' ? 60 : 0,
    scale: 0.85,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 28,
    },
  },
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Lock icon entering from top */}
          <motion.div custom="top" variants={itemVariants}>
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Lock className="w-7 h-7 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Loading text entering from bottom */}
          <motion.p
            custom="bottom"
            variants={itemVariants}
            className="text-sm uppercase tracking-[0.3em] text-neutral-400"
          >
            Authenticating
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return null;
}
