"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MemoraLogo } from "@/components/MemoraLogo";

export function MarketingNav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 py-4 sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <MemoraLogo variant="navbar" href={null} iconOnly />
          <span className="text-xl font-bold tracking-tight text-white">Memora</span>
        </Link>
        <nav className="flex items-center gap-6">
          <div className="hidden items-center gap-6 text-sm font-medium text-zinc-400 md:flex">
            <Link href="#como-funciona" className="hover:text-white transition-colors">
              Funcionamento
            </Link>
            <Link href="#recursos" className="hover:text-white transition-colors">
              Recursos
            </Link>
          </div>
          <Link
            href="/dashboard"
            className="group relative flex h-10 items-center justify-center overflow-hidden rounded-full bg-white px-6 text-sm font-medium text-zinc-950 transition-all hover:scale-[0.98] hover:bg-zinc-200 active:scale-[0.95]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Entrar
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-1">
                <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
