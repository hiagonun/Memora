"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, startOfWeek, endOfWeek, addMonths, subMonths, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { getMonthRevisions, markRevisionCompleted, RevisionRecord } from "@/lib/spacedRepetition";
import { motion, AnimatePresence } from "framer-motion";

export function GlassCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [revisions, setRevisions] = useState<RevisionRecord[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Carregar revisões do mês inteiro
  useEffect(() => {
    async function load() {
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
    }
    load();
  }, [currentDate]);

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
    // Atualização otimista
    setRevisions(prev => prev.map(r => r.id === revId ? { ...r, is_completed: !currentStatus } : r));
    try {
      await markRevisionCompleted(revId, !currentStatus);
    } catch {
      // Reverter se falhar
      setRevisions(prev => prev.map(r => r.id === revId ? { ...r, is_completed: currentStatus } : r));
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <GlassCard className="p-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium capitalize text-slate-800 dark:text-slate-200">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Header Dias da Semana */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium text-slate-500">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Grid de Dias */}
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day, idx) => {
            const revs = getRevisionsForDate(day);
            const pendingRevs = revs.filter(r => !r.is_completed);
            const isSelected = selectedDateStr === format(day, "yyyy-MM-dd");

            return (
              <button
                key={idx}
                onClick={() => setSelectedDateStr(format(day, "yyyy-MM-dd"))}
                className={`
                  relative h-14 w-full rounded-xl flex flex-col items-center justify-center text-sm transition-all
                  ${!isSameMonth(day, currentDate) ? "text-slate-400/40" : "text-slate-700 dark:text-slate-200"}
                  ${isToday(day) ? "bg-cyan-500/20 font-bold border border-cyan-500/30 text-cyan-700 dark:text-cyan-300" : ""}
                  ${isSelected ? "ring-2 ring-purple-500/50 bg-black/5 dark:bg-white/10 scale-105 z-10" : "hover:bg-black/5 dark:hover:bg-white/10"}
                `}
              >
                <span className="mt-1">{format(day, "d")}</span>
                
                {/* Dots Neon de identificação */}
                {revs.length > 0 && (
                  <div className="flex gap-0.5 mt-1 h-2">
                    {pendingRevs.slice(0, 3).map((_, i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    ))}
                    {pendingRevs.length > 3 && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Modal Diário */}
      <AnimatePresence>
        {selectedDateStr && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6"
          >
            <GlassCard className="p-6 relative">
              <button onClick={() => setSelectedDateStr(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition">
                ✕
              </button>
              
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                Revisões - {format(parseISO(selectedDateStr), "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              
              {selectedForSelectedDate.length === 0 ? (
                <p className="text-slate-500 text-sm py-4">
                  Nenhuma revisão agendada para este dia.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedForSelectedDate.map(rev => (
                    <div key={rev.id} className={`flex items-center gap-3 p-3 rounded-2xl transition border border-transparent
                      ${rev.is_completed ? "bg-black/5 dark:bg-white/5 opacity-60" : "bg-white/40 dark:bg-black/40 border-white/20"}
                    `}>
                      <button onClick={() => toggleCheck(rev.id, rev.is_completed)} className="focus:outline-none transition-transform hover:scale-110">
                        {rev.is_completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${rev.is_completed ? "text-slate-500 line-through" : ""}`}>
                          {rev.study?.subject} - {rev.study?.topic}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Curva do Esquecimento: Revisão R{rev.revision_number}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
