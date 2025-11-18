'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Press ? or / to open shortcuts
      if ((e.key === '?' || e.key === '/') && !isOpen) {
        setIsOpen(true);
      }
      // Press Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const shortcuts = [
    { keys: ['?', 'or', '/'], description: 'Open this help menu' },
    { keys: ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'], description: 'Konami code - Celebrate! 🎉' },
    { keys: ['Double-Click'], description: 'Like an item' },
    { keys: ['Esc'], description: 'Close modals and menus' },
  ];

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Press ? for shortcuts"
      >
        <Keyboard className="w-6 h-6" />
      </motion.button>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Keyboard Shortcuts</h2>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ rotate: 90 }}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-700">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono text-gray-700"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="mt-6 text-xs text-gray-500 text-center">
                Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">Esc</kbd> to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
