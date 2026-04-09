"use client";

import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, BookOpen } from "lucide-react";
import { StudyForm } from "@/components/StudyForm";
import { GlassCalendar } from "@/components/GlassCalendar";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-slate-800 dark:text-slate-100">
            Bem-vindo ao <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">Memora</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto">
            Suas revisões espaçadas organizadas através da Curva do Esquecimento, com o toque elegante que você merece.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3">
            <StudyForm />
          </div>
          <div className="w-full md:w-2/3">
            <GlassCalendar />
          </div>
        </div>
        
        <GlassCard className="flex items-center gap-6 p-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/40 dark:bg-black/40 flex items-center justify-center shadow-inner">
            <BookOpen className="w-5 h-5 text-pink-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">Revisões de Hoje</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Você tem 3 matérias para revisar hoje.</p>
          </div>
          <Button variant="outline" className="rounded-full bg-white/10 dark:bg-black/10 border-white/20 hover:bg-white/20">
            Começar
          </Button>
        </GlassCard>
      </div>
    </main>
  );
}
