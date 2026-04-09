import { LoginButton } from "./LoginButton";
import { BookOpen } from "lucide-react";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-sky-200/15 bg-[oklch(0.1_0.04_250/0.72)] px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150 sm:px-6 sm:pb-3.5">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-200/90 to-sky-400/80 shadow-[0_0_24px_-4px_rgba(56,189,248,0.5)] ring-1 ring-sky-100/40 sm:h-11 sm:w-11">
            <BookOpen className="h-5 w-5 text-sky-950 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={2} />
          </div>
          <span className="truncate text-lg font-medium tracking-tight text-sky-50 sm:text-xl">
            Memora
          </span>
        </div>

        <LoginButton />
      </div>
    </nav>
  );
}
