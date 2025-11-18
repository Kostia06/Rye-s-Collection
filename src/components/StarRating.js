'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function StarRating({ itemId, initialRating = 0, onRateChange = () => {} }) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRate = (newRating) => {
    setRating(newRating === rating ? 0 : newRating);
    onRateChange(newRating === rating ? 0 : newRating);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const starVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
    hover: { scale: 1.3 },
  };

  return (
    <motion.div
      className="flex gap-1 cursor-pointer"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <motion.button
          key={starIndex}
          variants={starVariants}
          whileHover="hover"
          onClick={() => handleRate(starIndex)}
          onMouseEnter={() => setHoveredRating(starIndex)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none"
        >
          <motion.div
            animate={{
              rotate: (hoveredRating >= starIndex || rating >= starIndex) ? [0, 15, -15, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Star
              className={`w-5 h-5 transition-all ${
                hoveredRating >= starIndex || rating >= starIndex
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-300 text-gray-300 hover:fill-yellow-300'
              }`}
            />
          </motion.div>
        </motion.button>
      ))}
    </motion.div>
  );
}
