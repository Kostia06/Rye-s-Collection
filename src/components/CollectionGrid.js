'use client';

import { motion } from 'framer-motion';
import CollectionCard from './CollectionCard';
import CollectionListItem from './CollectionListItem';
import { Sparkles, Package } from 'lucide-react';

export default function CollectionGrid({ items, loading, isAdmin, onEdit, onDelete, view = 'grid' }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-purple-500" />
        </motion.div>
        <p className="mt-4 text-gray-600 font-medium">Loading treasures...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Package className="w-24 h-24 text-purple-300 mb-4" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">
          No items yet!
        </h3>
        <p className="text-gray-500">
          The collection is waiting to be filled with treasures.
        </p>
      </motion.div>
    );
  }

  if (view === 'list') {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {items.map((item, index) => (
          <CollectionListItem
            key={item.id}
            item={item}
            index={index}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {items.map((item, index) => (
        <CollectionCard
          key={item.id}
          item={item}
          index={index}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
