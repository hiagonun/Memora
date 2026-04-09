"use client";

import { motion } from "framer-motion";

export function LiquidGlassBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Orb 1: Cyan */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-cyan-300/30 dark:bg-cyan-600/20 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70"
      />
      
      {/* Orb 2: Purple */}
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
          scale: [1, 0.8, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] rounded-full bg-purple-300/30 dark:bg-purple-600/20 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70"
      />
      
      {/* Orb 3: Pink */}
      <motion.div
        animate={{
          x: [0, 50, -100, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 left-1/3 w-[45vw] h-[45vw] rounded-full bg-pink-300/30 dark:bg-pink-600/20 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70"
      />
    </div>
  );
}
