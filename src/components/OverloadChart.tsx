"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";
import { supabase } from "@/lib/supabase/client";
import { addDays, format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

export function OverloadChart() {
  const [data, setData] = useState<{ day: string; revisoes: number; rawDate: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const today = startOfDay(new Date());
      const maxDate = addDays(today, 14);
      
      const { data: pending } = await supabase
        .from("revisions")
        .select("revision_date")
        .eq("is_completed", false)
        .gte("revision_date", format(today, "yyyy-MM-dd"))
        .lte("revision_date", format(maxDate, "yyyy-MM-dd"));
      
      const counts: Record<string, number> = {};
      if (pending) {
        pending.forEach(r => {
          counts[r.revision_date] = (counts[r.revision_date] || 0) + 1;
        });
      }

      const nextDays = Array.from({ length: 14 }).map((_, i) => {
        const d = addDays(today, i);
        const ymd = format(d, "yyyy-MM-dd");
        return {
          day: format(d, "dd MMM", { locale: ptBR }),
          rawDate: ymd,
          revisoes: counts[ymd] || 0,
        };
      });

      setData(nextDays);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-6 h-[400px] flex items-center justify-center">
        <span className="text-zinc-500 animate-pulse">Calculando previsões...</span>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 h-[400px] flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Previsão de Sobrecarga</h3>
        <p className="text-sm text-zinc-400">Pico de revisões agendadas para as próximas duas semanas</p>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis 
              dataKey="day" 
              stroke="#ffffff50" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#ffffff50" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                color: '#fff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#0ea5e9' }}
            />
            <Bar dataKey="revisoes" name="Revisões" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => {
                // Se passar de 5 revisões, colorir de advertência (ex: rose-500), senão azul.
                const color = entry.revisoes > 5 ? '#f43f5e' : '#38bdf8';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
