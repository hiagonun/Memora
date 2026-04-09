"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, startOfWeek, endOfWeek, addMonths, subMonths, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { getMonthRevisions, markRevisionCompleted, deleteStudy, RevisionRecord } from "@/lib/spacedRepetition";
import { supabase } from "@/lib/supabase/client";
import { deleteGoogleCalendarEvent } from "@/lib/googleCalendar";
import { toast } from "sonner";

export function GlassCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [revisions, setRevisions] = useState<RevisionRecord[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  
  // Deletion logic with custom modal
  const [deletingStudyId, setDeletingStudyId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMonthRevisions = useCallback(async () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });

    const startStr = format(start, "yyyy-MM-dd");
    const endStr = format(end, "yyyy-MM-dd");

    try {
      const data = await getMonthRevisions(startStr, endStr);
      setRevisions(data || []);
    } catch (err) {
      console.error("Erro ao carregar revisões:", err);
    }
  }, [currentDate]);

  // Carregar revisões do mês inteiro
  useEffect(() => {
    void loadMonthRevisions();
  }, [loadMonthRevisions]);

  useEffect(() => {
    const handleStudyCreated = () => {
      void loadMonthRevisions();
    };

    window.addEventListener("memora:study-created", handleStudyCreated);
    return () => window.removeEventListener("memora:study-created", handleStudyCreated);
  }, [loadMonthRevisions]);

  // Lista dos dias na visualização do mês atual
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getRevisionsForDate = (date: Date) => {
    const dStr = format(date, "yyyy-MM-dd");
    return revisions.filter(r => r.revision_date === dStr);
  };

  const selectedForSelectedDate = selectedDateStr 
    ? revisions.filter(r => r.revision_date === selectedDateStr) 
    : [];

  const toggleCheck = async (revId: string, currentStatus: boolean) => {
    const dStr = currentStatus ? "reaberta" : "concluída";
    setRevisions(prev => prev.map(r => r.id === revId ? { ...r, is_completed: !currentStatus } : r));
    try {
      await markRevisionCompleted(revId, !currentStatus);
      toast.success(`Revisão marcada como ${dStr}!`);
    } catch {
      setRevisions(prev => prev.map(r => r.id === revId ? { ...r, is_completed: currentStatus } : r));
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleDeleteStudy = async () => {
    if (!deletingStudyId) return;
    setIsDeleting(true);
    const studyId = deletingStudyId;
    
    const toastId = toast.loading("Removendo estudo e agendamentos...");

    try {
      const { data: revData } = await supabase
        .from("revisions")
        .select("calendar_event_id")
        .eq("study_id", studyId);

      const googleEventIds =
        revData?.map((r) => r.calendar_event_id).filter((id): id is string => Boolean(id)) ?? [];

      let providerToken: string | undefined;
      const { data: { session } } = await supabase.auth.getSession();
      providerToken = session?.provider_token ?? undefined;

      if (!providerToken && googleEventIds.length > 0) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        providerToken = refreshed.session?.provider_token ?? undefined;
      }

      if (googleEventIds.length > 0) {
        if (!providerToken) {
          toast.error(
            "Não foi possível acessar o Google Calendar (sessão expirada ou indisponível). Entre de novo com Google e tente apagar de novo — o estudo não foi removido do Memora.",
            { id: toastId, duration: 8000 }
          );
          return;
        }
        for (const eventId of googleEventIds) {
          await deleteGoogleCalendarEvent(providerToken, eventId);
        }
      }

      await deleteStudy(studyId);
      setRevisions((prev) => prev.filter((r) => r.study_id !== studyId));
      toast.success("Matéria removida com sucesso de todos os lugares!", { id: toastId });
      setDeletingStudyId(null);
    } catch (err) {
      console.error("Erro crítico ao apagar estudo:", err);
      const msg =
        err instanceof Error ? err.message : "Houve um erro ao apagar.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const weekLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

  return (
    <div className="flex h-full w-full flex-col gap-4 sm:gap-6">
      <GlassCard className="p-3 sm:p-6">
        {/* Cabeçalho */}
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-center text-lg font-medium capitalize leading-tight text-sky-50 sm:text-left sm:text-xl">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <div className="flex items-center justify-center gap-1 sm:justify-end sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="h-11 w-11 touch-manipulation rounded-full text-sky-100 hover:bg-sky-400/15 hover:text-sky-50 sm:h-10 sm:w-10"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-11 w-11 touch-manipulation rounded-full text-sky-100 hover:bg-sky-400/15 hover:text-sky-50 sm:h-10 sm:w-10"
              aria-label="Próximo mês"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Dias da semana — compacto no telefone */}
        <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[0.58rem] font-semibold uppercase leading-none tracking-tight text-sky-300/75 sm:mb-2 sm:gap-2 sm:text-xs sm:font-medium sm:leading-normal sm:tracking-normal">
          {weekLabels.map((day) => (
            <div key={day} className="truncate px-0.5 sm:px-1">
              <span className="sm:hidden">{day.slice(0, 3)}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}
        </div>

        {/* Grid de dias — células ≥44px para toque */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {daysInMonth.map((day, idx) => {
            const revs = getRevisionsForDate(day);
            const pendingRevs = revs.filter((r) => !r.is_completed);
            const isSelected = selectedDateStr === format(day, "yyyy-MM-dd");

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDateStr(format(day, "yyyy-MM-dd"))}
                className={[
                  "relative flex min-h-[44px] w-full touch-manipulation flex-col items-center justify-center rounded-lg text-xs transition-all sm:min-h-[52px] sm:rounded-xl sm:text-sm",
                  !isSameMonth(day, currentDate)
                    ? "text-sky-400/25"
                    : "text-sky-100/90",
                  isToday(day)
                    ? "border border-sky-300/40 bg-sky-400/20 font-semibold text-sky-50 shadow-[0_0_20px_-4px_rgba(56,189,248,0.45)]"
                    : "",
                  isSelected
                    ? "z-10 scale-[1.02] ring-2 ring-sky-300/50 ring-offset-2 ring-offset-[oklch(0.09_0.035_250)] sm:scale-105"
                    : "hover:bg-sky-400/10 active:bg-sky-400/20",
                ].join(" ")}
              >
                <span className="tabular-nums">{format(day, "d")}</span>

                {revs.length > 0 && (
                  <div className="mt-0.5 flex h-2 gap-0.5 sm:mt-1">
                    {pendingRevs.slice(0, 3).map((_, i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_6px_rgba(125,211,252,0.85)]"
                      />
                    ))}
                    {pendingRevs.length > 3 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400/60" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Modal Diário */}
      {selectedDateStr && (
        <div className="mt-4 sm:mt-6">
          <GlassCard className="relative p-4 sm:p-6">
            <button
              type="button"
              onClick={() => setSelectedDateStr(null)}
              className="absolute right-3 top-3 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-sky-950/30 text-sky-100 transition-colors hover:bg-sky-400/20 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
              aria-label="Fechar"
            >
              ✕
            </button>

            <h3 className="mb-4 border-b border-sky-200/15 pb-4 pr-12 text-base font-medium text-sky-50 sm:text-lg">
              Revisões - {format(parseISO(selectedDateStr), "dd 'de' MMMM", { locale: ptBR })}
            </h3>

            {selectedForSelectedDate.length === 0 ? (
              <p className="py-6 text-center text-sm text-sky-200/60">
                Nenhuma revisão agendada para este dia.
              </p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {selectedForSelectedDate.map((rev) => (
                  <div
                    key={rev.id}
                    className={[
                      "flex items-center gap-2 rounded-2xl border p-2.5 transition-colors sm:gap-3 sm:p-3",
                      rev.is_completed
                        ? "border-transparent bg-sky-950/25 opacity-70"
                        : "border-sky-200/15 bg-sky-400/[0.07]",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => toggleCheck(rev.id, rev.is_completed)}
                      className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 sm:h-10 sm:w-10"
                      aria-label={rev.is_completed ? "Marcar como pendente" : "Marcar como concluída"}
                    >
                      {rev.is_completed ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-sky-300/50" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium leading-snug sm:text-base ${rev.is_completed ? "text-sky-300/50 line-through" : "text-sky-50"}`}
                      >
                        {rev.study?.subject} - {rev.study?.topic}
                      </p>
                      <p className="text-xs text-sky-200/55">
                        Curva do esquecimento · R{rev.revision_number}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (rev.study_id) setDeletingStudyId(rev.study_id);
                      }}
                      className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-rose-400/90 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
                      title="Apagar matéria"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Confirmação de Exclusão Customizada (Glass Modal) */}
      {deletingStudyId && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-sky-950/65 backdrop-blur-sm p-3 sm:items-center sm:p-4">
          <div className="w-full max-w-sm pb-[env(safe-area-inset-bottom,0px)] sm:pb-0">
            <GlassCard className="border-sky-200/20 p-6 text-center sm:p-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 ring-1 ring-rose-400/25">
                <Trash2 className="h-8 w-8 text-rose-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-sky-50 sm:text-xl">Apagar estudo?</h3>
              <p className="mb-6 text-sm leading-relaxed text-sky-200/65">
                Remove a matéria no Memora e os eventos ligados no Google Calendar.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <Button
                  variant="ghost"
                  className="h-11 w-full rounded-full border border-sky-200/15 text-sky-100 hover:bg-sky-400/10 sm:flex-1"
                  onClick={() => setDeletingStudyId(null)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  className="h-11 w-full rounded-full border-0 bg-rose-500 text-white transition-colors hover:bg-rose-600 sm:flex-1"
                  onClick={handleDeleteStudy}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Apagando..." : "Apagar"}
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
