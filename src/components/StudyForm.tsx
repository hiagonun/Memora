"use client";

import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createStudy } from "@/lib/spacedRepetition";

export function StudyForm() {
  const [isOpen, setIsOpen] = useState(false);
  
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  // default to today YYYY-MM-DD
  const [studyDate, setStudyDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (!subject || !topic || !studyDate) {
        throw new Error("Preencha todos os campos.");
      }
      await createStudy(subject, topic, studyDate);
      setSuccessMsg("Estudo cadastrado! Suas revisões foram agendadas.");
      setSubject("");
      setTopic("");
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMsg("");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro desconhecido ao tentar cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!isOpen && (
        <GlassCard 
          className="flex flex-col items-center justify-center p-12 text-center group cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/40 dark:bg-black/40 flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110">
            <PlusCircle className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
          </div>
          <h2 className="text-2xl font-medium mb-2">Novo Estudo</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Registre uma nova matéria e nós calcularemos as 5 revisões.
          </p>
        </GlassCard>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-8 relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-medium mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-cyan-500" />
                Cadastrar Estudo
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-500/20 text-red-700 dark:text-red-300 rounded-xl text-sm backdrop-blur-md">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm backdrop-blur-md">
                    {successMsg}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium ml-1 text-slate-600 dark:text-slate-400">Matéria</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Direito"
                    className="w-full px-4 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-light"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium ml-1 text-slate-600 dark:text-slate-400">Assunto</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Tributário"
                    className="w-full px-4 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-light"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium ml-1 text-slate-600 dark:text-slate-400">Data do Estudo</label>
                  <input
                    type="date"
                    value={studyDate}
                    onChange={(e) => setStudyDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-light"
                    required
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="rounded-full px-8 bg-cyan-600/90 hover:bg-cyan-600 text-white backdrop-blur-md transition-all font-medium flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Criar Rotina
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
