import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Starfield } from "@/components/marketing/Starfield";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#030712] text-zinc-50 selection:bg-sky-500/30 selection:text-sky-50 leading-relaxed antialiased overflow-x-clip relative">
      {/* O Canvas estrelado ficará preso no fundo e visível apenas onde não há layers maciças preenchendo a cor limite */}
      <Starfield />
      <MarketingNav />
      <main className="flex-1 relative z-10">{children}</main>
    </div>
  );
}
