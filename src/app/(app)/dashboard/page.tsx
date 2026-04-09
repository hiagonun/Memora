"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { StudyManager } from "@/components/StudyManager";
import { GlassCalendar } from "@/components/GlassCalendar";
import { getPendingRevisions, markRevisionCompleted, type RevisionRecord } from "@/lib/spacedRepetition";
import { updateGoogleCalendarEvent } from "@/lib/googleCalendar";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"studies" | "calendar">("studies");
  const [todaySubjectsCount, setTodaySubjectsCount] = useState(0);
  const [todayPendingRevisions, setTodayPendingRevisions] = useState<RevisionRecord[]>([]);
  const [isCompletingToday, setIsCompletingToday] = useState(false);

  const loadTodayData = useCallback(async () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    try {
      const pending = await getPendingRevisions(todayStr);
      const uniqueStudyIds = new Set(pending.map((rev) => rev.study_id));
      setTodayPendingRevisions(pending);
      setTodaySubjectsCount(uniqueStudyIds.size);
    } catch {
      setTodayPendingRevisions([]);
      setTodaySubjectsCount(0);
    }
  }, []);

  const handleCompleteToday = async () => {
    if (todayPendingRevisions.length === 0 || isCompletingToday) return;

    const confirmation = await Swal.fire({
      title: "Concluir revisões de hoje?",
      text: "Marcaremos todas as revisões pendentes de hoje como concluídas no Memora e no Google Calendar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Concluir",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        container: "memora-swal-container",
        popup: "memora-swal-popup",
        title: "memora-swal-title",
        htmlContainer: "memora-swal-text",
        actions: "memora-swal-actions",
        confirmButton: "memora-swal-confirm",
        cancelButton: "memora-swal-cancel",
      },
    });

    if (!confirmation.isConfirmed) return;

    setIsCompletingToday(true);
    const toastId = toast.loading("Concluindo revisões de hoje...");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      let providerToken = session?.provider_token ?? undefined;

      const hasGoogleEvents = todayPendingRevisions.some((rev) => Boolean(rev.calendar_event_id));
      if (!providerToken && hasGoogleEvents) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        providerToken = refreshed.session?.provider_token ?? undefined;
      }

      for (const revision of todayPendingRevisions) {
        await markRevisionCompleted(revision.id, true);

        if (revision.calendar_event_id && providerToken) {
          const subject = revision.study?.subject ?? "Estudo";
          const topic = revision.study?.topic ?? "";

          await updateGoogleCalendarEvent(providerToken, revision.calendar_event_id, {
            summary: `Concluída - Revisão R${revision.revision_number} - ${subject}`,
            description: `Revisão concluída no Memora. Assunto: ${topic}. Curva do Esquecimento.`,
          });
        }
      }

      if (hasGoogleEvents && !providerToken) {
        toast.error("Revisões concluídas no Memora, mas sem sincronizar no Google Calendar.", {
          id: toastId,
          duration: 7000,
        });
      } else {
        toast.success("Revisões de hoje concluídas com sucesso!", { id: toastId });
      }

      window.dispatchEvent(new CustomEvent("memora:studies-changed"));
      await loadTodayData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao concluir revisões de hoje.";
      toast.error(message, { id: toastId });
    } finally {
      setIsCompletingToday(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "calendar") return;
    void loadTodayData();
  }, [activeTab, loadTodayData]);

  useEffect(() => {
    const refresh = () => {
      void loadTodayData();
    };

    window.addEventListener("memora:study-created", refresh);
    window.addEventListener("memora:studies-changed", refresh);

    return () => {
      window.removeEventListener("memora:study-created", refresh);
      window.removeEventListener("memora:studies-changed", refresh);
    };
  }, [loadTodayData]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-3 py-6 sm:px-5 sm:py-10 md:px-8">
      <div className="w-full space-y-8 sm:space-y-10 md:space-y-12">
        <header className="space-y-3 px-1 text-center sm:space-y-4">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold tracking-tighter text-white">
            Dashboard
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-zinc-400">
            Sua visão central. Acompanhe a saúde do seu cérebro e a próxima onda de revisões.
          </p>
        </header>

        <div className="mx-auto flex w-full max-w-sm rounded-[2rem] bg-zinc-900/40 p-1 ring-1 ring-white/10 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveTab("studies")}
            className={[
              "h-12 flex-1 rounded-[1.75rem] text-sm font-medium transition-all duration-300",
              activeTab === "studies"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-400 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            Estudos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={[
              "h-12 flex-1 rounded-[1.75rem] text-sm font-medium transition-all duration-300",
              activeTab === "calendar"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-400 hover:bg-white/5 hover:text-white",
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
          <div className="mx-auto w-full max-w-4xl space-y-8">
            <GlassCalendar />

            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8 rounded-[2.5rem] bg-zinc-900/40 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex shrink-0 items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-sky-500/10 ring-1 ring-sky-500/30">
                  <BookOpen className="h-6 w-6 text-sky-400" />
                </div>
                <div className="min-w-0 flex-1 sm:flex-initial">
                  <h3 className="text-lg font-semibold text-white">Revisões de hoje</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Você tem <strong className="text-white font-semibold">{todaySubjectsCount}</strong> {todaySubjectsCount === 1 ? "matéria" : "matérias"} para revisar
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => void handleCompleteToday()}
                disabled={todayPendingRevisions.length === 0 || isCompletingToday}
                className="group relative h-12 w-full shrink-0 overflow-hidden rounded-full border-0 bg-white px-8 text-sm font-medium text-zinc-950 hover:bg-zinc-200 transition-all active:scale-[0.98] sm:ml-auto sm:w-auto disabled:opacity-50 disabled:bg-white/10 disabled:text-white/50"
              >
                {isCompletingToday && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <span className="relative z-10 flex items-center gap-2">
                  {todayPendingRevisions.length === 0 ? "Tudo em dia" : "Concluir revisões"}
                </span>
                {!isCompletingToday && todayPendingRevisions.length > 0 && (
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-sky-400/0 via-sky-400/20 to-sky-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
