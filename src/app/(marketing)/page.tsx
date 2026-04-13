import { Hero } from "@/components/marketing/Hero";
import { BentoGrid } from "@/components/marketing/BentoGrid";
import { ForgettingCurve } from "@/components/marketing/ForgettingCurve";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTA } from "@/components/marketing/CTA";
import { MemoraLogo } from "@/components/MemoraLogo";

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <Hero />
      <BentoGrid />
      <ForgettingCurve />
      <Testimonials />
      <CTA />
      
      {/* Premium Dark Footer with Transition from CTA */}
      <footer className="relative w-full bg-zinc-950 pb-12 pt-0">
        {/* Fading glow line connector */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
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
