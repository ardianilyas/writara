'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const WORDS = [
  'presentation decks',
  'learning slides',
  'speaker notes',
  'study guides',
];

export function KineticText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-flex items-center justify-center px-4 py-1 mx-1.5 rounded-2xl bg-sky-50 border-2 border-sky-400/80 text-sky-600 shadow-sm align-baseline select-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ y: 16, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -16, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="font-black underline decoration-sky-300 decoration-wavy decoration-2 underline-offset-4 whitespace-nowrap"
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
