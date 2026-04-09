"use client";

import { motion } from "framer-motion";
import { NeuralBrain } from "./NeuralBrain";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] w-full items-center overflow-visible pt-24">
      {/* Aesthetic Dark Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-sky-900/20 via-sky-500/10 to-zinc-900/40 opacity-50 blur-[120px]" />
      
      <div className="mx-auto w-full max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          
          {/* Left Text Content */}
          <div className="flex flex-col items-start gap-8">

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[15ch] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tighter text-white"
            >
              Transforme a Curva do Esquecimento em uma vantagem.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[45ch] text-lg leading-relaxed text-zinc-400"
            >
              Agende revisões com inteligência antes de esquecer, consolide matérias extensas e construa conhecimento perene com o Memora.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/dashboard"
                className="group relative flex h-12 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-white px-8 text-sm font-medium text-zinc-950 transition-all hover:scale-[0.98] hover:bg-zinc-200 active:scale-[0.95]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Começar a estudar
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-1">
                    <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </Link>
              <Link
                href="#recursos"
                className="group flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-white/5 px-8 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10"
              >
                 Como funciona
              </Link>
            </motion.div>
          </div>

          {/* Right Visual - 3D Model floating freely, overflow-visible so glow doesn't clip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group relative aspect-[4/3] w-full overflow-visible md:aspect-square"
          >
            <NeuralBrain />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
