import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { StudyForm } from "@/components/StudyForm";
import { GlassCalendar } from "@/components/GlassCalendar";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-3 py-6 sm:px-5 sm:py-10 md:px-8">
      <div className="w-full space-y-8 sm:space-y-10 md:space-y-12">
        <header className="space-y-3 px-1 text-center sm:space-y-4">
          <h1 className="text-[clamp(1.75rem,5.5vw,3.5rem)] font-light leading-tight tracking-tight text-sky-50">
            Bem-vindo ao{" "}
            <span className="bg-gradient-to-r from-sky-200 via-sky-100 to-cyan-200 bg-clip-text font-semibold text-transparent drop-shadow-[0_0_28px_rgba(125,211,252,0.35)]">
              Memora
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-sm font-light leading-relaxed text-sky-100/75 sm:text-base md:text-lg">
            Suas revisões espaçadas organizadas pela Curva do Esquecimento — clara, calma, no tom de vidro líquido.
          </p>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
          <div className="w-full shrink-0 lg:max-w-md lg:flex-1">
            <StudyForm />
          </div>
          <div className="min-w-0 flex-1 lg:flex-[1.35]">
            <GlassCalendar />
          </div>
        </div>

        <GlassCard className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 ring-1 ring-sky-300/25 sm:h-14 sm:w-14">
              <BookOpen className="h-6 w-6 text-sky-200 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0 flex-1 sm:flex-initial">
              <h3 className="text-base font-medium text-sky-50 sm:text-lg">Revisões de hoje</h3>
              <p className="text-sm text-sky-200/65">Você tem 3 matérias para revisar hoje.</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="h-11 w-full shrink-0 rounded-full border-sky-300/25 bg-sky-400/10 text-sky-50 hover:bg-sky-400/20 sm:ml-auto sm:h-10 sm:w-auto sm:px-8"
          >
            Começar
          </Button>
        </GlassCard>
      </div>
    </main>
  );
}
