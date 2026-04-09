"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { MemoraLogo } from "@/components/MemoraLogo";
import { StudyManager } from "@/components/StudyManager";
import { GlassCalendar } from "@/components/GlassCalendar";
import { getPendingRevisions } from "@/lib/spacedRepetition";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"studies" | "calendar">("studies");
  const [todaySubjectsCount, setTodaySubjectsCount] = useState(0);

  const loadTodayCount = useCallback(async () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    try {
      const pending = await getPendingRevisions(todayStr);
      const uniqueStudyIds = new Set(pending.map((rev) => rev.study_id));
      setTodaySubjectsCount(uniqueStudyIds.size);
    } catch {
      setTodaySubjectsCount(0);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "calendar") return;
    void loadTodayCount();
  }, [activeTab, loadTodayCount]);

  useEffect(() => {
    const refresh = () => {
      void loadTodayCount();
    };

    window.addEventListener("memora:study-created", refresh);
    window.addEventListener("memora:studies-changed", refresh);

    return () => {
      window.removeEventListener("memora:study-created", refresh);
      window.removeEventListener("memora:studies-changed", refresh);
    };
  }, [loadTodayCount]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-3 py-6 sm:px-5 sm:py-10 md:px-8">
      <div className="w-full space-y-8 sm:space-y-10 md:space-y-12">
        <header className="space-y-3 px-1 text-center sm:space-y-4">
          <h1 className="text-[clamp(1.5rem,4.5vw,3rem)] font-light leading-tight tracking-tight text-sky-50">
            Bem-vindo
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-sm font-light leading-relaxed text-sky-100/75 sm:text-base md:text-lg">
            Suas revisões espaçadas organizadas pela Curva do Esquecimento.
          </p>
        </header>

        <div className="mx-auto flex w-full max-w-xl rounded-full border border-sky-200/15 bg-sky-950/30 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("studies")}
            className={[
              "h-11 flex-1 rounded-full text-sm font-medium transition-colors",
              activeTab === "studies"
                ? "bg-sky-400 text-sky-950"
                : "text-sky-100 hover:bg-sky-400/15",
            ].join(" ")}
          >
            Gerenciar estudos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={[
              "h-11 flex-1 rounded-full text-sm font-medium transition-colors",
              activeTab === "calendar"
                ? "bg-sky-400 text-sky-950"
                : "text-sky-100 hover:bg-sky-400/15",
            ].join(" ")}
          >
            Calendário
          </button>
        </div>

        {activeTab === "studies" && (
          <div className="mx-auto w-full max-w-3xl">
            <StudyManager />
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="space-y-6">
            <GlassCalendar />

            <GlassCard className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              <div className="flex shrink-0 items-center gap-4 sm:gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 ring-1 ring-sky-300/25 sm:h-14 sm:w-14">
                  <BookOpen className="h-6 w-6 text-sky-200 sm:h-7 sm:w-7" />
                </div>
                <div className="min-w-0 flex-1 sm:flex-initial">
                  <h3 className="text-base font-medium text-sky-50 sm:text-lg">Revisões de hoje</h3>
                  <p className="text-sm text-sky-200/65">
                    Você tem {todaySubjectsCount} {todaySubjectsCount === 1 ? "matéria" : "matérias"} para revisar hoje.
                  </p>
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
        )}
      </div>
    </main>
  );
}
