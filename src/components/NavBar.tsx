import { LoginButton } from "./LoginButton";
import { BookOpen } from "lucide-react";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/10 dark:bg-black/10 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-medium tracking-tight text-slate-800 dark:text-slate-100">
          Memora
        </span>
      </div>
      
      <LoginButton />
    </nav>
  );
}
