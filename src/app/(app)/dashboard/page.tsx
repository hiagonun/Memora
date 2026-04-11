"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Link as LinkIcon, FileIcon, CheckCircle2 } from "lucide-react";
import { StudyManager } from "@/components/StudyManager";
import { GlassCalendar } from "@/components/GlassCalendar";
import { PomodoroGlass } from "@/components/PomodoroGlass";
import { ConsistencyHeatmap } from "@/components/ConsistencyHeatmap";
import { OverloadChart } from "@/components/OverloadChart";
import { getPendingRevisions, markRevisionCompleted, type RevisionRecord } from "@/lib/spacedRepetition";
import { updateGoogleCalendarEvent } from "@/lib/googleCalendar";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"today" | "studies" | "calendar" | "stats">("today");
  const [todaySubjectsCount, setTodaySubjectsCount] = useState(0);
  const [todayPendingRevisions, setTodayPendingRevisions] = useState<RevisionRecord[]>([]);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

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

  const handleCompleteRevision = async (revision: RevisionRecord) => {
    if (loadingActionId) return;

    const confirmation = await Swal.fire({
      title: "Concluir esta revisão?",
      text: "Isso marcará essa revisão específica como feita hoje.",
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

    setLoadingActionId(revision.id);
    const toastId = toast.loading("Registrando conclusão...");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      let providerToken = session?.provider_token ?? undefined;

      if (!providerToken && revision.calendar_event_id) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        providerToken = refreshed.session?.provider_token ?? undefined;
      }

      await markRevisionCompleted(revision.id, true);

      if (revision.calendar_event_id && providerToken) {
        const subject = revision.study?.subject ?? "Estudo";
        const topic = revision.study?.topic ?? "";

        await updateGoogleCalendarEvent(providerToken, revision.calendar_event_id, {
          summary: `Concluída - Revisão R${revision.revision_number} - ${subject}`,
          description: `Revisão concluída no Memora. Assunto: ${topic}. Curva do Esquecimento.`,
        });
      }

      if (revision.calendar_event_id && !providerToken) {
        toast.error("Concluída no Memora (Aviso: Sem sync no Google Calendar).", { id: toastId });
      } else {
        toast.success("Revisão registrada com sucesso!", { id: toastId });
      }

      window.dispatchEvent(new CustomEvent("memora:studies-changed"));
      await loadTodayData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao concluir a revisão.";
      toast.error(message, { id: toastId });
    } finally {
      setLoadingActionId(null);
    }
  };

  useEffect(() => {
    void loadTodayData();
  }, [loadTodayData]);

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

        <div className="mx-auto flex w-full max-w-2xl rounded-[2rem] bg-zinc-900/40 p-1 ring-1 ring-white/10 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveTab("today")}
            className={[
              "h-12 flex-1 rounded-[1.75rem] text-sm font-medium transition-all duration-300",
              activeTab === "today"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-400 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            Revisões de Hoje
          </button>
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
          <button
            type="button"
            onClick={() => setActiveTab("stats")}
            className={[
              "h-12 flex-1 rounded-[1.75rem] text-sm font-medium transition-all duration-300",
              activeTab === "stats"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-400 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            Estatísticas
          </button>
        </div>

        {activeTab === "today" && (
          <div className="mx-auto w-full max-w-3xl space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/30">
                <BookOpen className="h-6 w-6 text-sky-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">Tarefas do dia</h2>
                <p className="text-sm text-zinc-400">
                  {todayPendingRevisions.length === 0 
                    ? "Nenhuma revisão pendente para hoje." 
                    : `Você tem ${todayPendingRevisions.length} revisão(ões) programada(s).`}
                </p>
              </div>
            </div>

            {todayPendingRevisions.length === 0 ? (
              <GlassCard className="p-12 text-center flex flex-col items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Tudo em dia!</h3>
                <p className="text-zinc-400 mt-2 max-w-sm">Você completou todas as revisões programadas para hoje. Descanse ou cadastre novos estudos.</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {todayPendingRevisions.map((revision) => {
                  const atts = revision.study?.attachments || [];
                  const isCompleting = loadingActionId === revision.id;

                  return (
                    <GlassCard key={revision.id} className="p-5 sm:p-6 transition-all hover:bg-white/[0.02]">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center rounded-full bg-sky-500/20 px-2 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/30">
                              Revisão {revision.revision_number}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white truncate">
                            {revision.study?.subject}
                          </h3>
                          <p className="text-zinc-400 text-sm mt-1">{revision.study?.topic}</p>

                          {/* Seção de anexos */}
                          {atts.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Materiais</p>
                              <div className="flex flex-col gap-2">
                                {atts.map((att: any, idx: number) => (
                                  <a
                                    key={idx}
                                    href={att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-fit items-center gap-2 rounded-lg bg-black/40 px-3 py-2 text-sm text-zinc-300 hover:bg-black/60 hover:text-white transition-colors border border-white/5"
                                  >
                                    {att.type === 'link' ? <LinkIcon className="h-4 w-4 text-sky-400" /> : <FileIcon className="h-4 w-4 text-emerald-400" />}
                                    <span className="truncate max-w-[250px]">{att.name}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 sm:mt-0 pt-2 sm:pt-0 shrink-0">
                          <Button
                            onClick={() => handleCompleteRevision(revision)}
                            disabled={Boolean(loadingActionId)}
                            className="w-full sm:w-auto rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200"
                          >
                            {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                            Marcar feita
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "studies" && (
          <div className="mx-auto w-full max-w-3xl">
            <StudyManager />
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="mx-auto w-full max-w-4xl space-y-8">
            <GlassCalendar />
          </div>
        )}

        {activeTab === "stats" && (
          <div className="mx-auto w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
            <ConsistencyHeatmap />
            <OverloadChart />
          </div>
        )}
      </div>
      <PomodoroGlass />
    </main>
  );
}
