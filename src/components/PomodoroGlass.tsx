"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, X, Clock } from "lucide-react";
import { GlassCard } from "./GlassCard";

export function PomodoroGlass() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = 1 - timeLeft / (25 * 60);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900/60 ring-1 ring-white/10 backdrop-blur-xl transition-all hover:bg-zinc-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Clock className="relative z-10 h-6 w-6 text-white" />
        {isRunning && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-sky-500"></span>
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 origin-bottom-right">
      <GlassCard className="p-6 relative shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] border border-white/20 bg-zinc-950/80">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 text-zinc-500 hover:text-white transition-colors p-1"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center">
          <h3 className="mb-4 text-sm font-medium text-zinc-300 tracking-wider uppercase">Pomodoro Timer</h3>

          <div className="relative mb-6 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg width="140" height="140" viewBox="0 0 100 100" className="-rotate-90 transform">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold tracking-tighter text-white">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <button
              onClick={toggleTimer}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-950 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="ml-1 h-5 w-5" />}
            </button>
            <button
              onClick={resetTimer}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95 border border-white/10"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
