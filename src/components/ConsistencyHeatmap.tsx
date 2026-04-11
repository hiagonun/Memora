"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";
import { supabase } from "@/lib/supabase/client";
import { format, subDays, startOfDay } from "date-fns";

export function ConsistencyHeatmap() {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: revs } = await supabase
        .from("revisions")
        .select("completed_at")
        .eq("is_completed", true)
        .not("completed_at", "is", null);

      if (revs) {
        const hash: Record<string, number> = {};
        for (const r of revs) {
           const d = r.completed_at.split("T")[0]; 
           hash[d] = (hash[d] || 0) + 1;
        }
        setData(hash);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Generate last 98 days (14 weeks x 7 days)
  const today = startOfDay(new Date());
  const daysArray = Array.from({ length: 98 }).map((_, i) => {
    const d = subDays(today, 97 - i);
    return format(d, "yyyy-MM-dd");
  });

  if (loading) {
    return (
      <GlassCard className="p-6 h-[200px] flex items-center justify-center">
        <span className="text-zinc-500 animate-pulse">Carregando mapa termal...</span>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Consistência de Estudos</h3>
          <p className="text-sm text-zinc-400">Histórico de conclusões dos últimos 3 meses</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Menos</span>
          <div className="w-3 h-3 rounded-sm bg-white/5" />
          <div className="w-3 h-3 rounded-sm bg-sky-500/20" />
          <div className="w-3 h-3 rounded-sm bg-sky-500/50" />
          <div className="w-3 h-3 rounded-sm bg-sky-400" />
          <span>Mais</span>
        </div>
      </div>
      
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div 
          style={{ width: "max-content" }}
          className="grid gap-[6px] grid-rows-7 grid-flow-col"
        >
          {daysArray.map((dateStr) => {
            const count = data[dateStr] || 0;
            let themeClass = 'bg-white/[0.03] ring-1 ring-white/5'; // 0
            if (count === 1) themeClass = 'bg-sky-500/20 ring-1 ring-sky-500/30';
            if (count > 1 && count <= 3) themeClass = 'bg-sky-500/50 ring-1 ring-sky-500/60 shadow-[0_0_10px_rgba(14,165,233,0.3)]';
            if (count > 3) themeClass = 'bg-sky-400 ring-2 ring-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]';
            
            return (
              <div 
                key={dateStr}
                title={`${dateStr}: ${count} revisões completadas`}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] ${themeClass} transition-all hover:ring-2 hover:ring-white`}
              />
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
