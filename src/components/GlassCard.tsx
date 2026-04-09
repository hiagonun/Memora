import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-sky-200/15 p-5 sm:rounded-3xl sm:p-6",
        "bg-sky-950/18",
        "shadow-[0_6px_18px_-10px_rgba(0,0,0,0.6)]",
        className
      )}
      {...props}
    >
      <div className="contents">{children}</div>
    </div>
  );
}
