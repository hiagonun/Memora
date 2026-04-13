"use client";

import Link from "next/link";

// Botão focado em efeitos CSS puros no hover (transform scale/translate e sombras)
function HoverAction({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="group relative flex h-16 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-white px-10 text-[15px] font-bold tracking-tight text-zinc-950 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.4)]"
    >
      <span className="relative z-10 flex items-center gap-3">
        {children}
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:translate-x-1">
          <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {/* Glow dinâmico interno no hover */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </Link>
  );
}

export function CTA() {
  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden py-32 z-0 bg-gradient-to-b from-[#030712] to-zinc-950">

      {/* Câmera de Fundo: Vídeo com leve blur conforme spec */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <video
          src="https://cbieyixzfbdnodniqqgk.supabase.co/storage/v1/object/public/videos/Whisk_ydzmhdnizdmycdnj1ynmztytitolrtl4mtox0cz.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover blur-[4px] opacity-70"
        />
        {/* Overlay Escuro para Legibilidade */}
        <div className="absolute inset-0 bg-zinc-950/40" />

        {/* Transições superiores e inferiores do scroll */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#030712] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      {/* Painel Centralizado (Melhor preenchimento do CTA sem gaps massivos) - Liquid Glass */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        <div
          className="flex flex-col items-center text-center justify-center gap-10 overflow-hidden rounded-[2.5rem] bg-zinc-900/40 py-16 px-6 md:px-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 backdrop-blur-2xl"
        >
          {/* Typografia Determinística e Limpa */}
          <div className="flex flex-col items-center max-w-[60ch]">
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-tighter text-white">
              Sua memória tem potencial ilimitado
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-zinc-400">
              Destrave a velocidade máxima de aprendizado. Conecte seus estudos à engenharia de repetição espaçada do Memora.
            </p>
          </div>

          {/* Grupo de Ação */}
          <div className="flex flex-col items-center gap-5 w-full">
            <HoverAction href="/dashboard">
              Dê o primeiro passo
            </HoverAction>

            <p className="text-sm font-medium text-zinc-500">
              Acesso imediato. Nenhum risco envolvido.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
