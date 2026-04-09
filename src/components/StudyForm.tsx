"use client";

import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createStudy } from "@/lib/spacedRepetition";
import { supabase } from "@/lib/supabase/client";
import { createGoogleCalendarEvent } from "@/lib/googleCalendar";
import { toast } from "sonner";

const inputClass =
  "w-full min-h-[48px] rounded-2xl border border-sky-200/15 bg-sky-950/20 px-4 py-3 text-base text-sky-50 shadow-inner outline-none backdrop-blur-md transition placeholder:text-sky-300/35 focus:border-sky-300/40 focus:ring-2 focus:ring-sky-400/35 sm:min-h-[44px] sm:text-sm";

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
          className="group flex cursor-pointer flex-col items-center justify-center p-8 text-center active:scale-[0.99] sm:p-10 md:p-12"
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
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] ring-1 ring-sky-300/25 transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:h-[4.5rem] sm:w-[4.5rem]">
            <PlusCircle className="h-9 w-9 text-sky-200 sm:h-10 sm:w-10" strokeWidth={1.75} />
          </div>
          <h2 className="mb-2 text-xl font-medium text-sky-50 sm:text-2xl">Novo estudo</h2>
          <p className="max-w-xs text-pretty text-sm leading-relaxed text-sky-200/65 sm:text-base">
            Registre uma matéria e calculamos as 5 revisões na curva do esquecimento.
          </p>
        </GlassCard>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="relative p-5 sm:p-8">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-sky-950/35 text-sky-100 transition hover:bg-sky-400/20 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                aria-label="Fechar"
              >
                ✕
              </button>

              <h2 className="mb-6 flex items-center gap-2 pr-12 text-xl font-medium text-sky-50 sm:text-2xl">
                <PlusCircle className="h-6 w-6 shrink-0 text-sky-300" strokeWidth={1.75} />
                Cadastrar estudo
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="study-subject" className="ml-1 text-sm font-medium text-sky-200/80">
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

                <div className="space-y-1.5">
                  <label htmlFor="study-topic" className="ml-1 text-sm font-medium text-sky-200/80">
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

                <div className="space-y-1.5">
                  <label htmlFor="study-date" className="ml-1 text-sm font-medium text-sky-200/80">
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

                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-full border-0 bg-gradient-to-r from-sky-400 to-sky-500 text-sky-950 shadow-[0_8px_28px_-6px_rgba(56,189,248,0.55)] transition hover:from-sky-300 hover:to-sky-400 sm:h-11 sm:w-auto sm:min-w-[10rem] sm:px-10"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Criar rotina
                  </Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
