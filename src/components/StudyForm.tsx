"use client";

import { useState, useRef } from "react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { PlusCircle, Loader2, Link as LinkIcon, Paperclip, Trash2, File as FileIcon } from "lucide-react";
import { createStudy, StudyAttachment } from "@/lib/spacedRepetition";
import { supabase } from "@/lib/supabase/client";
import { createGoogleCalendarEvent } from "@/lib/googleCalendar";
import { toast } from "sonner";

const inputClass =
  "w-full min-h-[48px] rounded-xl ring-1 ring-white/10 bg-black/20 px-4 py-3 text-base text-white outline-none transition-all placeholder:text-zinc-500 hover:ring-white/20 focus:bg-black/40 focus:ring-2 focus:ring-sky-400/50 sm:min-h-[44px] sm:text-sm";

type FormAttachment = { id: string; type: "link" | "file"; url: string; name: string; file?: File; };

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
  const [studyTime, setStudyTime] = useState("");

  const [attachments, setAttachments] = useState<FormAttachment[]>([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkName, setLinkName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const handleAddLink = () => {
    if (!linkUrl) return;
    setAttachments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "link", url: linkUrl, name: linkName || linkUrl },
    ]);
    setLinkUrl("");
    setLinkName("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const newAtts = files.map(file => ({
      id: crypto.randomUUID(),
      type: "file" as const,
      url: "",
      name: file.name,
      file,
    }));
    setAttachments((prev) => [...prev, ...newAtts]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter(a => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!subject || !topic || !studyDate) {
        throw new Error("Preencha todos os campos.");
      }

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const providerToken = session?.provider_token;

      let finalAttachments: StudyAttachment[] = [];
      if (attachments.length > 0 && userId) {
        toast.info("Enviando anexos...");
        for (const att of attachments) {
          if (att.type === "file" && att.file) {
            const filePath = `${userId}/${Date.now()}_${att.file.name}`;
            const { data, error } = await supabase.storage.from("study-materials").upload(filePath, att.file);
            if (!error) {
              const { data: { publicUrl } } = supabase.storage.from("study-materials").getPublicUrl(filePath);
              finalAttachments.push({ type: "file", url: publicUrl, name: att.name });
            } else {
              toast.error(`Falha ao subir ${att.name}`);
            }
          } else if (att.type === "link") {
            finalAttachments.push({ type: "link", url: att.url, name: att.name });
          }
        }
      }

      const { revisions } = await createStudy(subject, topic, studyDate, finalAttachments);

      if (providerToken) {
        toast.info("Agendando revisões no Google Calendar...");
        for (const rev of revisions) {
        const gEvent = await createGoogleCalendarEvent(providerToken, {
            summary: `Revisão R${rev.revision_number} - ${subject}`,
            description: `Revisão do assunto: ${topic}. Curva do Esquecimento.`,
            startDate: rev.revision_date,
            ...(studyTime && { startTime: studyTime }),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
      setStudyTime("");
      setAttachments([]);
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <label htmlFor="study-time" className="ml-1 text-sm font-medium text-zinc-300">
                  Horário (Opcional)
                </label>
                <input
                  id="study-time"
                  type="time"
                  value={studyTime}
                  onChange={(e) => setStudyTime(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="ml-1 text-sm font-medium text-zinc-300">Anexos e Links</label>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-4">
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="url"
                      placeholder="URL do link"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder="Nome do link (opcional)"
                      value={linkName}
                      onChange={(e) => setLinkName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <Button type="button" onClick={handleAddLink} variant="ghost" className="h-[42px] px-3 bg-white/5 text-white hover:bg-white/10">
                    Adicionar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Ou selecione arquivos (PDF, etc)</span>
                  <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-[42px] px-3 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Selecionar Arquivos
                  </Button>
                </div>

                {attachments.length > 0 && (
                  <ul className="mt-4 space-y-2 pt-4 border-t border-white/10">
                    {attachments.map(att => (
                      <li key={att.id} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg">
                        <div className="flex items-center space-x-3 overflow-hidden text-sm">
                          {att.type === "link" ? <LinkIcon className="h-4 w-4 text-sky-400 flex-shrink-0" /> : <FileIcon className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                          <span className="truncate max-w-[200px] sm:max-w-xs">{att.name}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveAttachment(att.id)} className="h-8 w-8 text-rose-500 hover:bg-rose-500/20 rounded-full">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
