"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { Star } from "@phosphor-icons/react";

const TESTIMONIALS = [
  {
    name: "Mariana Costa",
    role: "Medicina · USP",
    avatar: "https://picsum.photos/seed/mariana1/150/150",
    quote:
      "Usava metodologias complexas por anos, mas o Memora mudou tudo. A integração transparente reduziu minha fricção e a curva de retenção é assustadoramente precisa. Passei em Semiologia com a maior nota.",
    metric: "+38%",
    metricLabel: "na nota final",
    rating: 5,
  },
  {
    name: "Rafael Nunes",
    role: "Concurso · Auditor Fiscal",
    avatar: "https://picsum.photos/seed/rafael9/150/150",
    quote:
      "A preparação para fisco exige reter uma montanha de dados desconexos. O algoritmo de repetição distribui as revisões de tal forma que chego na prova lembrando da vírgula da lei.",
    metric: "3×",
    metricLabel: "volume de retenção",
    rating: 5,
  },
  {
    name: "Ana Beatriz Lima",
    role: "Direito · PUC",
    avatar: "https://picsum.photos/seed/ana22/150/150",
    quote:
      "Antes eu lia a jurisprudência e esquecia na semana seguinte. Com o Memora, o problema não era eu, era a falta de sistema. Consolidei artigos inteiros na memória.",
    metric: "−60%",
    metricLabel: "tempo gasto re-estudando",
    rating: 5,
  },
  {
    name: "Carlos Eduardo",
    role: "Engenheiro de Software",
    avatar: "https://picsum.photos/seed/carlos4/150/150",
    quote:
      "Estrutura de dados requer aprofundamento. A repetição espaçada funciona incrivelmente bem para reter conceitos técnicos. Consegui a aprovação técnica após 3 meses de uso.",
    metric: "100%",
    metricLabel: "sucesso na etapa técnica",
    rating: 5,
  },
];

const STATS = [
  { value: 10000, suffix: "+", label: "estudantes" },
  { value: 92, suffix: "%", label: "retenção observada" },
  { value: 4.9, suffix: "/5", label: "média das avaliações", decimals: 1 },
  { value: 38, suffix: "%", label: "aumento médio de notas" },
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col items-center text-center gap-4"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl max-w-3xl">
            Estudantes reais redefinindo seus limites de cognição.
          </h2>
          <p className="max-w-[50ch] text-base leading-relaxed text-zinc-400">
            A adaptação definitiva da ciência da repetição espaçada às necessidades do presente.
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
