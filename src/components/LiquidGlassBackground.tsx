"use client";

import { motion, useReducedMotion } from "framer-motion";

export function LiquidGlassBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-[oklch(0.075_0.038_252)]"
      aria-hidden
    >
      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,oklch(0.35_0.08_230/0.25),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_100%,oklch(0.25_0.06_250/0.2),transparent_50%)]" />

      {/* Orb 1 — ice baby blue */}
      <motion.div
        animate={
          reduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : {
                x: [0, "8vw", "-5vw", 0],
                y: [0, "-12vh", "6vh", 0],
                scale: [1, 1.08, 0.95, 1],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] left-[-15%] h-[min(85vw,420px)] w-[min(85vw,420px)] rounded-full bg-sky-200/25 blur-[80px] sm:h-[min(70vw,520px)] sm:w-[min(70vw,520px)] sm:blur-[100px]"
      />

      {/* Orb 2 — powder blue */}
      <motion.div
        animate={
          reduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : {
                x: [0, "-10vw", "6vw", 0],
                y: [0, "10vh", "-8vh", 0],
                scale: [1, 0.92, 1.06, 1],
              }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] -right-[10%] h-[min(75vw,380px)] w-[min(75vw,380px)] rounded-full bg-sky-300/20 blur-[75px] sm:h-[min(60vw,480px)] sm:w-[min(60vw,480px)] sm:blur-[95px]"
      />

      {/* Orb 3 — cool periwinkle depth */}
      <motion.div
        animate={
          reduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : {
                x: [0, "6vw", "-8vw", 0],
                y: [0, "8vh", "12vh", 0],
                scale: [1, 1.05, 0.98, 1],
              }
        }
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-15%] left-[15%] h-[min(95vw,440px)] w-[min(95vw,440px)] rounded-full bg-blue-300/15 blur-[90px] sm:bottom-[-10%] sm:h-[min(75vw,560px)] sm:w-[min(75vw,560px)] sm:blur-[110px]"
      />

      {/* Specular sheen (subtle) */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,oklch(0.95_0.02_220/0.04)_48%,transparent_56%)]" />
    </div>
  );
}
