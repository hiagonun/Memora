import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] p-6 sm:p-8",
        "bg-zinc-900/40 backdrop-blur-xl",
        "ring-1 ring-white/10",
        "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]",
        className
      )}
      {...props}
    >
      <div className="contents">{children}</div>
    </div>
  );
}
