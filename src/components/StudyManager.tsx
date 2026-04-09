"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { StudyForm } from "@/components/StudyForm";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { deleteStudy, getStudies, StudyRecord, updateStudy } from "@/lib/spacedRepetition";
import { supabase } from "@/lib/supabase/client";
import { deleteGoogleCalendarEvent, updateGoogleCalendarEvent } from "@/lib/googleCalendar";

const inputClass =
  "w-full min-h-[42px] rounded-xl ring-1 ring-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-zinc-500 hover:ring-white/20 focus:bg-black/40 focus:ring-2 focus:ring-sky-400/50";

function formatDateLabel(dateStr: string) {
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function StudyManager() {
  const [studies, setStudies] = useState<StudyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editSubject, setEditSubject] = useState("");
  const [editTopic, setEditTopic] = useState("");

  const loadStudies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudies();
      setStudies(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar estudos.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStudies();
  }, [loadStudies]);

  useEffect(() => {
    const refresh = () => {
      void loadStudies();
    };

    window.addEventListener("memora:study-created", refresh);
    window.addEventListener("memora:studies-changed", refresh);

    return () => {
      window.removeEventListener("memora:study-created", refresh);
      window.removeEventListener("memora:studies-changed", refresh);
    };
  }, [loadStudies]);

  const startEdit = (study: StudyRecord) => {
    setEditingId(study.id);
    setEditSubject(study.subject);
    setEditTopic(study.topic);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSubject("");
    setEditTopic("");
  };

  const handleSave = async (studyId: string) => {
    if (!editSubject.trim() || !editTopic.trim()) {
      toast.error("Matéria e assunto são obrigatórios.");
      return;
    }

    const nextSubject = editSubject.trim();
    const nextTopic = editTopic.trim();

    setSavingId(studyId);
    try {
      await updateStudy(studyId, {
        subject: nextSubject,
        topic: nextTopic,
      });

      const { data: revisionData } = await supabase
        .from("revisions")
        .select("calendar_event_id, revision_number")
        .eq("study_id", studyId);

      const linkedEvents =
        revisionData
          ?.filter((r) => Boolean(r.calendar_event_id))
          .map((r) => ({
            eventId: r.calendar_event_id as string,
            revisionNumber: r.revision_number as number,
          })) ?? [];

      if (linkedEvents.length > 0) {
        let providerToken: string | undefined;
        const {
          data: { session },
        } = await supabase.auth.getSession();
        providerToken = session?.provider_token ?? undefined;

        if (!providerToken) {
          const { data: refreshed } = await supabase.auth.refreshSession();
          providerToken = refreshed.session?.provider_token ?? undefined;
        }

        if (!providerToken) {
          toast.error("Estudo salvo no Memora, mas não foi possível atualizar no Google Calendar.");
        } else {
          for (const linkedEvent of linkedEvents) {
            await updateGoogleCalendarEvent(providerToken, linkedEvent.eventId, {
              summary: `Revisão R${linkedEvent.revisionNumber} - ${nextSubject}`,
              description: `Revisão do assunto: ${nextTopic}. Curva do Esquecimento.`,
            });
          }
        }
      }

      toast.success("Estudo atualizado com sucesso.");
      cancelEdit();
      await loadStudies();
      window.dispatchEvent(new CustomEvent("memora:studies-changed"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar estudo.";
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (studyId: string) => {
    setDeletingId(studyId);
    const toastId = toast.loading("Removendo estudo...");

    try {
      const { data: revData } = await supabase
        .from("revisions")
        .select("calendar_event_id")
        .eq("study_id", studyId);

      const googleEventIds =
        revData?.map((r) => r.calendar_event_id).filter((id): id is string => Boolean(id)) ?? [];

      let providerToken: string | undefined;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      providerToken = session?.provider_token ?? undefined;

      if (!providerToken && googleEventIds.length > 0) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        providerToken = refreshed.session?.provider_token ?? undefined;
      }

      if (googleEventIds.length > 0 && providerToken) {
        for (const eventId of googleEventIds) {
          await deleteGoogleCalendarEvent(providerToken, eventId);
        }
      }

      await deleteStudy(studyId);
      toast.success("Estudo apagado.", { id: toastId });
      await loadStudies();
      window.dispatchEvent(new CustomEvent("memora:studies-changed"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao apagar estudo.";
      toast.error(message, { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const requestDelete = (studyId: string) => {
    void Swal.fire({
      title: "Apagar estudo?",
      text: "Esta ação remove o estudo e todas as revisões vinculadas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Apagar",
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
    }).then((result) => {
      if (result.isConfirmed) {
        void handleDelete(studyId);
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <StudyForm />

      <GlassCard className="p-0 sm:p-2">
        <div className="mb-2 flex items-center justify-between gap-3 px-5 pt-6 sm:px-6">
          <h2 className="text-lg font-semibold text-white">Estudos vigentes</h2>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-zinc-300">
            {studies.length}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center font-medium py-12 text-sm text-zinc-400">
            <Loader2 className="mr-3 h-5 w-5 animate-spin text-white" /> Carregando base de dados...
          </div>
        ) : studies.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            O cronograma de revisões está vazio.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-white/5 px-2 mt-4 sm:px-4">
            {studies.map((study) => {
              const isEditing = editingId === study.id;
              const isSaving = savingId === study.id;
              const isDeleting = deletingId === study.id;

              return (
                <div
                  key={study.id}
                  className="py-5 sm:py-6 group transition-all"
                >
                  {isEditing ? (
                    <div className="space-y-4 px-2 sm:px-4">
                      <div className="space-y-2">
                        <label className="ml-1 text-xs font-medium text-zinc-400 uppercase tracking-wider">Matéria</label>
                        <input
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                          className={inputClass}
                          autoComplete="off"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="ml-1 text-xs font-medium text-zinc-400 uppercase tracking-wider">Assunto</label>
                        <input
                          value={editTopic}
                          onChange={(e) => setEditTopic(e.target.value)}
                          className={inputClass}
                          autoComplete="off"
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-2">
                        <Button
                          variant="ghost"
                          className="h-10 rounded-full bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                          onClick={cancelEdit}
                          disabled={isSaving}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                        <Button
                          className="h-10 rounded-full bg-white text-zinc-950 hover:bg-zinc-200"
                          onClick={() => void handleSave(study.id)}
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 sm:px-4">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white">
                          {study.subject}
                        </p>
                        <p className="truncate text-sm text-zinc-400 mt-1">{study.topic}</p>
                        <p className="mt-2 text-xs font-medium text-sky-400/80">
                          Adicionado em {formatDateLabel(study.study_date)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          variant="ghost"
                          className="h-10 rounded-full bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                          onClick={() => startEdit(study)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only sm:ml-2">Editar</span>
                        </Button>
                        <Button
                          className="h-10 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                          onClick={() => requestDelete(study.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          <span className="sr-only sm:not-sr-only sm:ml-2">Apagar</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
