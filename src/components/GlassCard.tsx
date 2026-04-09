import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl shadow-black/5 rounded-3xl p-6",
        "transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
