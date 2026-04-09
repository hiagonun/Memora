import { Hero } from "@/components/marketing/Hero";
import { BentoGrid } from "@/components/marketing/BentoGrid";
import { MemoraLogo } from "@/components/MemoraLogo";

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <Hero />
      <BentoGrid />
      
      {/* Premium Dark Footer */}
      <footer className="w-full border-t border-white/10 bg-zinc-950/50 backdrop-blur-md py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <MemoraLogo variant="navbar" href={null} iconOnly />
            <span className="text-xl font-bold tracking-tight text-white">Memora</span>
          </div>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Memora. Aprenda de forma definitiva.
          </p>
        </div>
      </footer>
    </div>
  );
}
