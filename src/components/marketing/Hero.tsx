"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.1]);

  return (
    <section ref={ref} className="relative flex min-h-[100dvh] w-full items-center overflow-hidden pt-24 z-0">
      {/* Background Video with Native Alpha Mask fade out */}
      <motion.div
        className="absolute inset-0 z-0 h-full w-full pointer-events-none"
        style={{
          scale,
          opacity,
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)"
        }}
      >
        <video
          src="https://cbieyixzfbdnodniqqgk.supabase.co/storage/v1/object/public/videos/Whisk_mmz1emyxytojrznm1sm1qdotgjzzqtl5i2y20iy.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-[110%] w-full object-cover blur-[5px] mix-blend-luminosity -top-[5%] relative"
        />
        {/* Soft dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[#09090b]/60" />
      </motion.div>

      <div className="mx-auto w-full max-w-7xl px-6 relative z-10 border-white/10">
        <div className="flex flex-col items-center justify-center text-center gap-8 max-w-4xl mx-auto">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,6vw,4.5rem)] max-w-[22ch] font-bold leading-[1.05] tracking-tighter text-white"
          >
            Transforme a Curva do Esquecimento em uma vantagem.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[55ch] text-lg leading-relaxed text-zinc-300"
          >
            Agende revisões com inteligência antes de esquecer, consolide matérias extensas e construa conhecimento perene com o Memora.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/dashboard"
              className="group relative flex h-12 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-white px-8 text-sm font-medium text-zinc-950 transition-all hover:scale-[0.98] hover:bg-zinc-200 active:scale-[0.95]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Começar a estudar
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-1">
                  <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>
            <Link
              href="#recursos"
              className="group flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-white/5 px-8 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10 backdrop-blur-sm"
            >
              Como funciona
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
