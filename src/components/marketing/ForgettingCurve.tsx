"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Brain, RepeatOnce, HourglassHigh } from "@phosphor-icons/react";

// Data points for the forgetting curve (time in hours, retention %)
const WITHOUT_MEMORA = [
  { t: 0, r: 100 },
  { t: 1, r: 44 },
  { t: 8, r: 35 },
  { t: 24, r: 28 },
  { t: 72, r: 22 },
  { t: 168, r: 18 },
  { t: 720, r: 13 },
];

// With spaced repetition: multiple "resets"
const WITH_MEMORA_SEGMENTS = [
  // Initial learning
  [{ t: 0, r: 100 }, { t: 24, r: 60 }],
  // Review 1 → rises to ~90%
  [{ t: 24, r: 90 }, { t: 72, r: 75 }],
  // Review 2 → rises to ~95%
  [{ t: 72, r: 95 }, { t: 168, r: 85 }],
  // Review 3 → stable ~98%
  [{ t: 168, r: 98 }, { t: 720, r: 92 }],
];

const REVIEW_POINTS = [
  { t: 24, label: "1° revisão", r: 90 },
  { t: 72, label: "2° revisão", r: 95 },
  { t: 168, label: "3° revisão", r: 98 },
];

const W = 700;
const H = 280;
const PAD = { top: 20, right: 24, bottom: 48, left: 48 };

function timeToX(t: number) {
  // log scale
  const maxLog = Math.log(721);
  const minLog = Math.log(1);
  const frac = Math.log(Math.max(t, 1)) / maxLog;
  return PAD.left + frac * (W - PAD.left - PAD.right);
}
function retentionToY(r: number) {
  return PAD.top + (1 - r / 100) * (H - PAD.top - PAD.bottom);
}

function buildPath(points: { t: number; r: number }[]) {
  return points
    .map((p, i) =>
      i === 0
        ? `M ${timeToX(p.t)} ${retentionToY(p.r)}`
        : `L ${timeToX(p.t)} ${retentionToY(p.r)}`
    )
    .join(" ");
}

function buildSmoothPath(points: { t: number; r: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${timeToX(points[0].t)} ${retentionToY(points[0].r)}`;
  for (let i = 1; i < points.length; i++) {
    const x0 = timeToX(points[i - 1].t);
    const y0 = retentionToY(points[i - 1].r);
    const x1 = timeToX(points[i].t);
    const y1 = retentionToY(points[i].r);
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

function AnimatedCounter({ target, suffix = "%", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

export function ForgettingCurve() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [showMemora, setShowMemora] = useState(false);
  const [hoveredReview, setHoveredReview] = useState<number | null>(null);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setShowMemora(true), 1200);
      return () => clearTimeout(t);
    }
  }, [inView]);

  const forgettingPath = buildSmoothPath(WITHOUT_MEMORA);
  const memoraSegmentPaths = WITH_MEMORA_SEGMENTS.map((seg) => buildSmoothPath(seg));

  const xLabels = [
    { t: 1, label: "1h" },
    { t: 24, label: "1d" },
    { t: 72, label: "3d" },
    { t: 168, label: "1sem" },
    { t: 720, label: "1mês" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 overflow-hidden"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-sky-500/5 blur-[140px]" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[100px]" />
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
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-1.5 ring-1 ring-sky-500/20">
            <Brain className="h-4 w-4 text-sky-400" weight="fill" />
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-400">
              Neurociência aplicada
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl max-w-3xl">
            A ciência que transforma estudo em{" "}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              memória permanente
            </span>
          </h2>
          <p className="max-w-[55ch] text-base leading-relaxed text-zinc-400">
            Em 1885, Ebbinghaus descobriu que esquecemos 56% do que aprendemos em 1 hora — sem reforço. O Memora usa repetição espaçada para inverter essa curva.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative rounded-[2.5rem] bg-zinc-900/40 ring-1 ring-white/10 backdrop-blur-xl overflow-hidden p-6 sm:p-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-white">Retenção ao longo do tempo</h3>
              <div className="flex items-center gap-5 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <div className="h-0.5 w-6 rounded-full bg-zinc-500" />
                  <span>Sem suporte</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-0.5 w-6 rounded-full bg-gradient-to-r from-sky-400 to-violet-400" />
                  <span>Com Memora</span>
                </div>
              </div>
            </div>

            <div className="relative w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full min-w-[360px]"
                style={{ height: "auto" }}
              >
                {/* Grid lines */}
                {[20, 40, 60, 80, 100].map((pct) => (
                  <g key={pct}>
                    <line
                      x1={PAD.left}
                      x2={W - PAD.right}
                      y1={retentionToY(pct)}
                      y2={retentionToY(pct)}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <text
                      x={PAD.left - 8}
                      y={retentionToY(pct) + 4}
                      textAnchor="end"
                      fontSize="11"
                      fill="rgba(255,255,255,0.3)"
                    >
                      {pct}%
                    </text>
                  </g>
                ))}

                {/* X axis labels */}
                {xLabels.map(({ t, label }) => (
                  <text
                    key={t}
                    x={timeToX(t)}
                    y={H - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fill="rgba(255,255,255,0.3)"
                  >
                    {label}
                  </text>
                ))}

                {/* Forgetting curve (without) — fill */}
                {inView && (
                  <motion.path
                    d={`${forgettingPath} L ${timeToX(720)} ${retentionToY(0)} L ${timeToX(0)} ${retentionToY(0)} Z`}
                    fill="url(#forgettingFill)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                )}

                {/* Forgetting curve (without) */}
                {inView && (
                  <motion.path
                    d={forgettingPath}
                    fill="none"
                    stroke="rgba(161,161,170,0.5)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                  />
                )}

                {/* Memora segments */}
                {showMemora &&
                  memoraSegmentPaths.map((path, i) => {
                    const seg = WITH_MEMORA_SEGMENTS[i];
                    const fillId = `memoraFill${i}`;
                    const fillPath = `${path} L ${timeToX(seg[seg.length - 1].t)} ${retentionToY(0)} L ${timeToX(seg[0].t)} ${retentionToY(0)} Z`;
                    return (
                      <g key={i}>
                        <motion.path
                          d={fillPath}
                          fill={`url(#${fillId})`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: i * 0.25 }}
                        />
                        <motion.path
                          d={path}
                          fill="none"
                          stroke="url(#memoraStroke)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.25 }}
                        />
                      </g>
                    );
                  })}

                {/* Review spike lines + dots */}
                {showMemora &&
                  REVIEW_POINTS.map((rp, i) => (
                    <g key={i}>
                      <motion.line
                        x1={timeToX(rp.t)}
                        x2={timeToX(rp.t)}
                        y1={retentionToY(0)}
                        y2={retentionToY(rp.r)}
                        stroke="rgba(56,189,248,0.3)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        style={{ transformOrigin: `${timeToX(rp.t)}px ${retentionToY(0)}px` }}
                        transition={{ duration: 0.4, delay: i * 0.25 + 0.1 }}
                      />
                      <motion.circle
                        cx={timeToX(rp.t)}
                        cy={retentionToY(rp.r)}
                        r="5"
                        fill="url(#dotGrad)"
                        stroke="white"
                        strokeWidth="1.5"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ transformOrigin: `${timeToX(rp.t)}px ${retentionToY(rp.r)}px` }}
                        transition={{ duration: 0.3, delay: i * 0.25 + 0.3, type: "spring" }}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredReview(i)}
                        onMouseLeave={() => setHoveredReview(null)}
                      />
                      {hoveredReview === i && (
                        <g>
                          <rect
                            x={timeToX(rp.t) - 38}
                            y={retentionToY(rp.r) - 30}
                            width="76"
                            height="22"
                            rx="6"
                            fill="rgba(14,17,23,0.9)"
                            stroke="rgba(56,189,248,0.3)"
                            strokeWidth="1"
                          />
                          <text
                            x={timeToX(rp.t)}
                            y={retentionToY(rp.r) - 14}
                            textAnchor="middle"
                            fontSize="10"
                            fill="rgba(56,189,248,1)"
                            fontWeight="600"
                          >
                            {rp.label} — {rp.r}%
                          </text>
                        </g>
                      )}
                    </g>
                  ))}

                {/* Defs */}
                <defs>
                  <linearGradient id="forgettingFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(161,161,170,0.08)" />
                    <stop offset="100%" stopColor="rgba(161,161,170,0)" />
                  </linearGradient>
                  {WITH_MEMORA_SEGMENTS.map((_, i) => (
                    <linearGradient key={i} id={`memoraFill${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(56,189,248,0.12)" />
                      <stop offset="100%" stopColor="rgba(56,189,248,0)" />
                    </linearGradient>
                  ))}
                  <linearGradient id="memoraStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                  <radialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Annotation */}
            {showMemora && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-4 flex items-center gap-2 text-xs text-zinc-600"
              >
                <span>Passe o mouse sobre os pontos de revisão para detalhes</span>
              </motion.div>
            )}
          </motion.div>

          {/* Stats column */}
          <div className="flex flex-col gap-4">
            {[
              {
                Icon: Brain,
                label: "Retido em 1 mês",
                value: 92,
                suffix: "%",
                sub: "contra 13% sem revisão",
              },
              {
                Icon: RepeatOnce,
                label: "Melhor retenção",
                value: 150,
                suffix: "%",
                sub: "Karpicke & Roediger, 2008",
              },
              {
                Icon: HourglassHigh,
                label: "Esquecimento em 1h",
                value: 56,
                suffix: "%",
                sub: "Ebbinghaus, 1885",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                className="group relative flex flex-col gap-2 rounded-[1.5rem] bg-zinc-900/40 p-6 ring-1 ring-white/[0.07] backdrop-blur-xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] hover:ring-white/[0.14] transition-all duration-300"
              >
                {/* Label row — icon inline, no container */}
                <div className="flex items-center gap-2">
                  <stat.Icon
                    className="h-4 w-4 text-zinc-500 shrink-0"
                    weight="duotone"
                  />
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                    {stat.label}
                  </p>
                </div>
                {/* Big number */}
                <p className="text-5xl font-bold tracking-tighter text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                {/* Source / sub */}
                <p className="text-xs text-zinc-600 leading-relaxed border-t border-white/[0.05] pt-2">
                  {stat.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
