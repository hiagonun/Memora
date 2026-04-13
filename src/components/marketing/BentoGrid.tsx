"use client";

import { motion } from "framer-motion";
import { Brain, CalendarCheck, Clock, ChartLineUp } from "@phosphor-icons/react";
import { Calendar3D } from "./Calendar3D";
import { useRef, useState } from "react";

function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden group ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

export function BentoGrid() {
  return (
    <section id="recursos" className="relative w-full py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-20 flex flex-col items-start gap-4 max-w-2xl">
          <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold tracking-tighter text-white leading-[1.05]">
            Arquitetura voltada para retenção profunda.
          </h2>
          <p className="text-lg leading-relaxed text-zinc-400">
            Desenhamos o motor do Memora para eliminar qualquer sobrecarga de decisão. Suas informações fluem do input cru para a memória de longo prazo sem atrito mecânico.
          </p>
        </div>

        {/* Bento Grid: 3 cols, 2 rows */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* Card 1: Sincronização Absoluta - Vertical tall (col-span-1, row-span-2) */}
          <SpotlightCard className="flex flex-col rounded-[2.5rem] bg-zinc-900/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 backdrop-blur-xl md:row-span-2 min-h-[500px]">
            {/* Text at the top with padding */}
            <div className="p-8 z-10 pointer-events-none relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <CalendarCheck weight="regular" className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold tracking-tight text-white">
                Sincronia Temporal Passiva
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                O sistema espelha e distribui seus intervalos de revisão no próprio Google Calendar. Nenhuma configuração manual imposta.
              </p>
            </div>
            {/* Calendar 3D fills the rest of the card */}
            <div className="relative flex-1 min-h-[260px] z-10">
              <Calendar3D />
            </div>
          </SpotlightCard>

          {/* Card 2: Curva Automática - Vertical tall (col-span-1, row-span-2) */}
          <SpotlightCard className="flex flex-col rounded-[2.5rem] bg-zinc-900/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 backdrop-blur-xl md:row-span-2 min-h-[500px]">
            <div className="p-8 z-10 pointer-events-none relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <Brain weight="regular" className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold tracking-tight text-white">
                Decaimento Monitorado
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                O algoritmo detecta a meia-vida da sua memória iterativa e força você a revisar o bloco apenas quando a falha neural é iminente.
              </p>
            </div>
            <div className="relative flex-1 flex items-center justify-center p-0 pb-10 z-10 pointer-events-none">
              <div
                className="relative aspect-square w-full max-w-[280px]"
                style={{
                  WebkitMaskImage: "radial-gradient(circle at center, black 45%, transparent 75%)",
                  maskImage: "radial-gradient(circle at center, black 5%, transparent 65%)"
                }}
              >
                <video
                  src="https://cbieyixzfbdnodniqqgk.supabase.co/storage/v1/object/public/videos/Whisk_y2y1yto1y2m0mmmi1sz2mwotmgo5qtllzgmy0im.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-90"
                />
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3: Zero Fricção */}
          <SpotlightCard className="flex flex-col rounded-[2.5rem] bg-zinc-900/40 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 backdrop-blur-xl">
            <div className="z-10 relative pointer-events-none">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <Clock weight="regular" className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold tracking-tight text-white">
                Design Subtrativo
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Remoção agressiva de menus flutuantes. Sem dashboards superlotados, apenas o que deve ser absorvido agora.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 4: Evolução Real */}
          <SpotlightCard className="flex flex-col rounded-[2.5rem] bg-sky-950 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-white/10 backdrop-blur-xl">
            <div className="z-10 relative pointer-events-none">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/20 ring-1 ring-sky-300/30">
                <ChartLineUp weight="regular" className="h-6 w-6 text-sky-100" />
              </div>
              <h3 className="mb-2 text-xl font-semibold tracking-tight text-sky-50">
                Visualização Analítica
              </h3>
              <p className="text-sm leading-relaxed text-sky-200/70">
                Métricas que traduzem esforço bruto em gráficos de retenção e previsibilidade matemática.
              </p>
            </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
}
