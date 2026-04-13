"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { Star } from "@phosphor-icons/react";

const TESTIMONIALS = [
  {
    name: "Gabriel V.",
    role: "Pesquisador · Deep Learning",
    avatar: "https://picsum.photos/seed/gabriel77/150/150",
    quote:
      "A densidade técnica exigida pela leitura contínua de papers estava arruinando meu workflow. Integrei meus resumos na infraestrutura do Memora e agora o resgate dos teoremas durante os laboratórios práticos é impecavelmente cirúrgico.",
    metric: "94.2%",
    metricLabel: "precisão de resgate",
    rating: 5,
  },
  {
    name: "Dr. Lucas Machado",
    role: "R1 Neurologia · Unifesp",
    avatar: "https://picsum.photos/seed/lucas9/150/150",
    quote:
      "Aprender a neuroanatomia do tronco encefálico sem um sistema algorítmico de suporte é insanidade. O aplicativo varreu a necessidade de planear minhas revisões do mapa. Ele obriga o meu cérebro a recuperar os dados minutos antes de eu esquecer ativamente.",
    metric: "4.5×",
    metricLabel: "ganho de tempo orgânico",
    rating: 5,
  },
  {
    name: "Júlia C.",
    role: "Auditoria Fiscal (Empossada)",
    avatar: "https://picsum.photos/seed/julia001/150/150",
    quote:
      "O gap entre falhar no concurso e ficar nas vagas primárias é errar um artigo obscuro na legislação fiscal. A leitura ingênua não serve para nada na via pública; a brutalidade dessa curva matemática segurou minha base teórica à prova de fogo.",
    metric: "Zero",
    metricLabel: "perda de jurisprudência passiva",
    rating: 5,
  },
  {
    name: "Felipe T.",
    role: "Engenheiro de Software · Fintech",
    avatar: "https://picsum.photos/seed/felipe5g/150/150",
    quote:
      "Arquitetura de sistemas distribuídos força sua memória em várias abstrações ao mesmo tempo. A repetição aqui não é um bônus, é pragmatismo defensivo. Consegui cruzar a barreira sênior porque nunca precisei re-aprender o que fechei há seis meses.",
    metric: "Integral",
    metricLabel: "absorção estrutural",
    rating: 5,
  },
];

const STATS = [
  { value: 12400, suffix: "+", label: "cargas ativas diárias" },
  { value: 94.6, suffix: "%", label: "taxa exata de retenção", decimals: 1 },
  { value: 4.97, suffix: "", label: "índice algorítmico", decimals: 2 },
  { value: 3.1, suffix: "×", label: "coeficiente de absorção", decimals: 1 },
];

function AnimatedCounter({
  target,
  suffix = "",
  decimals = 0,
  duration = 2,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const ctrl = animate(0, target, {
            duration,
            ease: "easeOut",
            onUpdate: (v) =>
              setValue(decimals ? parseFloat(v.toFixed(decimals)) : Math.round(v)),
          });
          return () => ctrl.stop();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, decimals]);

  return (
    <span ref={ref}>
      {decimals ? value.toFixed(decimals) : value.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 text-amber-400" weight="fill" />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const goTo = (idx: number) => {
    setActive(idx);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 4000);
  };

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(advance, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, advance]);

  const t = TESTIMONIALS[active];

  return (
    <section className="relative w-full py-28 sm:py-36 overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 w-[600px] h-[400px] rounded-full bg-violet-500/5 blur-[120px]" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[300px] rounded-full bg-sky-500/5 blur-[100px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        {/* Header Asymmetric Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 flex flex-col lg:flex-row items-start justify-between gap-10 border-b border-white/5 pb-10"
        >
          <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold tracking-tighter text-white leading-[1.05] max-w-xl">
            O paradoxo da hiper-retenção em alto nível.
          </h2>
          <p className="max-w-[45ch] text-lg leading-relaxed text-zinc-400 lg:pt-4">
            Não otimizamos para estudantes passivos. O Memora é a infraestrutura de linha de comando para profissionais lidando com restrições críticas de volume e tempo.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 rounded-[1.5rem] bg-zinc-900/40 py-6 px-4 ring-1 ring-white/10 backdrop-blur-xl text-center"
            >
              <p className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                  duration={2}
                />
              </p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Carousel */}
        <div className="relative mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[2.5rem] bg-zinc-900/40 p-8 sm:p-12 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="relative z-10 flex flex-col gap-8">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={t.avatar} 
                      alt={t.name}
                      className="h-14 w-14 rounded-full object-cover ring-1 ring-white/10 shadow-sm"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-base font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-zinc-400">{t.role}</p>
                    </div>
                  </div>
                  <StarRating count={t.rating} />
                </div>

                {/* Quote */}
                <blockquote className="relative">
                  <p className="text-xl leading-relaxed text-zinc-300">
                    "{t.quote}"
                  </p>
                </blockquote>

                {/* Metric inline */}
                <div className="flex flex-col border-t border-white/5 pt-6 sm:flex-row sm:items-baseline sm:gap-3">
                  <p className="text-3xl font-bold tracking-tighter text-white">
                    {t.metric}
                  </p>
                  <p className="text-sm text-zinc-400">{t.metricLabel}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ver depoimento ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Progress bar */}
          {!isPaused && (
            <div className="mt-4 mx-auto max-w-xs h-px bg-white/10 rounded-full overflow-hidden">
              <motion.div
                key={active}
                className="h-full bg-gradient-to-r from-sky-400 to-violet-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
