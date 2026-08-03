'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const WORDS = [
  'presentation deck',
  'learning slides',
  'speaker notes',
  'study guide',
];

export function KineticText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-block relative overflow-hidden align-baseline h-[1.3em] min-w-[260px] sm:min-w-[340px] text-center sm:text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ y: 35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -35, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          className="absolute inset-0 text-sky-500 underline decoration-sky-300 decoration-wavy decoration-2 underline-offset-8 whitespace-nowrap"
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
