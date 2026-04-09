"use client";

import { motion } from "framer-motion";
import { Brain, CalendarCheck, Clock, ChartLineUp } from "@phosphor-icons/react";
import { Calendar3D } from "./Calendar3D";

export function BentoGrid() {
  return (
    <section id="recursos" className="relative w-full py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A forma definitiva de reter conhecimento.
          </h2>
          <p className="max-w-[60ch] text-base leading-relaxed text-zinc-400">
            Nenhuma interface genérica. O Memora foi esculpido para que a fricção técnica chegue a zero, deixando o foco integralmente com o seu cérebro.
          </p>
        </div>

        {/* Bento Grid: 3 cols, 2 rows */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* Card 1: Sincronização Absoluta - Vertical tall (col-span-1, row-span-2) */}
          <div className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-zinc-900/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 backdrop-blur-xl md:row-span-2 min-h-[500px]">
            {/* Text at the top with padding */}
            <div className="p-8 z-10 pointer-events-none relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <CalendarCheck weight="regular" className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold tracking-tight text-white">
                Sincronização Absoluta
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                O Memora envia e organiza seus estudos diretamente no Google Calendar sem delay.
              </p>
            </div>
            {/* Calendar 3D fills the rest of the card */}
            <div className="relative flex-1 min-h-[260px]">
              <Calendar3D />
            </div>
          </div>

          {/* Card 2: Curva Automática - Vertical tall (col-span-1, row-span-2) */}
          <div className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-zinc-900/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 backdrop-blur-xl md:row-span-2 min-h-[500px]">
            <div className="p-8 z-10 pointer-events-none relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <Brain weight="regular" className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold tracking-tight text-white">
                Curva Automática
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Cálculo preciso que agenda revisões nos momentos de maior fragilidade neural. O sistema pensa por você.
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-3 px-8 pb-8">
              {[1, 2, 3, 4].map((val) => (
                <div key={val} className="flex h-12 w-full animate-pulse flex-col items-start justify-center gap-2 rounded-xl bg-white/5 px-4 shadow-sm ring-1 ring-white/5"
                  style={{ animationDelay: `${val * 200}ms` }}>
                  <div className="h-1.5 w-1/3 rounded-full bg-zinc-600" />
                  <div className="h-1.5 w-1/5 rounded-full bg-zinc-700" />
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Zero Fricção */}
          <div className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-zinc-900/40 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 backdrop-blur-xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <Clock weight="regular" className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold tracking-tight text-white">
              Zero Fricção
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Painel minimalista centrado no momento presente. Ação sem distração.
            </p>
          </div>

          {/* Card 4: Evolução Real */}
          <div className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-sky-950 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-white/10 backdrop-blur-xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/20 ring-1 ring-sky-300/30">
              <ChartLineUp weight="regular" className="h-6 w-6 text-sky-100" />
            </div>
            <h3 className="mb-2 text-xl font-semibold tracking-tight text-sky-50">
              Evolução Real
            </h3>
            <p className="text-sm leading-relaxed text-sky-200/70">
              Métricas que traduzem esforço em consistência matemática.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
