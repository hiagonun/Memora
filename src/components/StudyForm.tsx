"use client";

import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { createStudy } from "@/lib/spacedRepetition";
import { supabase } from "@/lib/supabase/client";
import { createGoogleCalendarEvent } from "@/lib/googleCalendar";
import { toast } from "sonner";

const inputClass =
  "w-full min-h-[48px] rounded-xl ring-1 ring-white/10 bg-black/20 px-4 py-3 text-base text-white outline-none transition-all placeholder:text-zinc-500 hover:ring-white/20 focus:bg-black/40 focus:ring-2 focus:ring-sky-400/50 sm:min-h-[44px] sm:text-sm";

export function StudyForm() {
  const [isOpen, setIsOpen] = useState(false);

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [studyDate, setStudyDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!subject || !topic || !studyDate) {
        throw new Error("Preencha todos os campos.");
      }

      const { revisions } = await createStudy(subject, topic, studyDate);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const providerToken = session?.provider_token;

      if (providerToken) {
        toast.info("Agendando revisões no Google Calendar...");
        for (const rev of revisions) {
          const gEvent = await createGoogleCalendarEvent(providerToken, {
            summary: `Revisão R${rev.revision_number} - ${subject}`,
            description: `Revisão do assunto: ${topic}. Curva do Esquecimento.`,
            startDate: rev.revision_date,
          });

          if (gEvent?.id) {
            await import("@/lib/spacedRepetition").then((m) =>
              m.updateRevisionEventId(rev.id, gEvent.id)
            );
          }
        }
      }

      toast.success("Estudo cadastrado e sincronizado!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("memora:study-created", { detail: { studyDate } }));
        window.dispatchEvent(new CustomEvent("memora:studies-changed"));
      }
      setSubject("");
      setTopic("");
      setIsOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!isOpen && (
        <GlassCard
          className="group flex cursor-pointer flex-col items-center justify-center p-8 text-center sm:p-10 md:p-12"
          onClick={() => setIsOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 sm:mb-6 sm:h-[4.5rem] sm:w-[4.5rem] transition-colors group-hover:bg-white/10">
            <PlusCircle className="h-8 w-8 text-white sm:h-9 sm:w-9" strokeWidth={1.5} />
          </div>
          <h2 className="mb-2 text-xl font-medium text-white sm:text-2xl">Novo estudo</h2>
          <p className="max-w-sm text-pretty text-sm leading-relaxed text-zinc-400 sm:text-base">
            Cadastre uma matéria e o algoritmo calculará as 5 próximas revisões exatas.
          </p>
        </GlassCard>
      )}

      {isOpen && (
        <GlassCard className="relative p-5 sm:p-8">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 touch-manipulation items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
          >
            ✕
          </button>

          <h2 className="mb-8 flex items-center gap-3 pr-12 text-xl font-semibold text-white sm:text-2xl">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 ring-1 ring-white/10">
              <PlusCircle className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
            Cadastrar estudo
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="study-subject" className="ml-1 text-sm font-medium text-zinc-300">
                Matéria
              </label>
              <input
                id="study-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Direito"
                className={inputClass}
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="study-topic" className="ml-1 text-sm font-medium text-zinc-300">
                Assunto
              </label>
              <input
                id="study-topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Tributário"
                className={inputClass}
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="study-date" className="ml-1 text-sm font-medium text-zinc-300">
                Data do estudo
              </label>
              <input
                id="study-date"
                type="date"
                value={studyDate}
                onChange={(e) => setStudyDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="group relative h-12 w-full rounded-full border-0 bg-white text-zinc-950 transition-all hover:bg-zinc-200 active:scale-[0.98] sm:h-11 sm:w-auto sm:min-w-[12rem] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-sky-400/10 to-sky-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2 font-medium">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Criar cronograma
                </span>
              </Button>
            </div>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
