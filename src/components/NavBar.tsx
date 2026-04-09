import Link from "next/link";
import { LoginButton } from "./LoginButton";
import { MemoraLogo } from "./MemoraLogo";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-sky-200/15 bg-[oklch(0.1_0.04_250/0.92)] px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] shadow-[0_4px_14px_-8px_rgba(0,0,0,0.65)] sm:px-6 sm:pb-3.5">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.09_0.035_250)] sm:gap-3"
        >
          <MemoraLogo variant="navbar" href={null} iconOnly />
          <span className="truncate text-lg font-medium tracking-tight text-sky-50 sm:text-xl">
            Memora
          </span>
        </Link>

        <LoginButton />
      </div>
    </nav>
  );
}
