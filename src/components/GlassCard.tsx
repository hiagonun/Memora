import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border border-sky-200/15 p-5 shadow-2xl sm:rounded-3xl sm:p-6",
        "bg-gradient-to-br from-sky-100/[0.07] via-white/[0.03] to-sky-200/[0.04]",
        "backdrop-blur-2xl backdrop-saturate-150",
        "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.12),inset_0_-1px_0_0_rgba(125,211,252,0.06)]",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[linear-gradient(125deg,rgba(186,230,253,0.14)_0%,transparent_42%,transparent_58%,rgba(147,197,253,0.08)_100%)] before:opacity-80",
        "after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:z-20 after:h-px after:bg-gradient-to-r after:from-transparent after:via-sky-200/35 after:to-transparent",
        "transition-[transform,box-shadow,background-color] duration-300 ease-out",
        "hover:border-sky-200/25 hover:shadow-[0_12px_48px_-10px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.14)]",
        "max-sm:active:scale-[0.995]",
        className
      )}
      {...props}
    >
      <div className="contents">{children}</div>
    </div>
  );
}
