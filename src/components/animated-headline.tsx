"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ["Organize", "Create", "Host", "Discover"];
const colors = [
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-fuchsia-500",
    "from-violet-400 to-pink-500",
    "from-sky-400 to-cyan-500",
];

export default function AnimatedHeadline() {
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return (
      <span className="inline-block relative">
        <span className={`bg-gradient-to-r ${colors[0]} bg-clip-text text-transparent`}>
          {words[0]}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex relative flex-col overflow-hidden h-[1.2em] w-full max-w-[500px] justify-center items-center align-top">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ y: 60, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -60, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-r ${colors[index]} bg-clip-text text-transparent`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
