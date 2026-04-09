"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { User as AuthUser } from "@supabase/supabase-js";
import { LogOut, UserCircle } from "lucide-react";
import { toast } from "sonner";

export function LoginButton() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const isConfigMissing =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co";

    if (isConfigMissing) {
      toast.error(
        "Configure as credenciais do Supabase no arquivo .env (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY) para testar o login.",
        { duration: 7000 }
      );
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar.events",
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : "/",
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="h-11 w-28 animate-pulse rounded-full bg-sky-400/10 ring-1 ring-sky-200/10" />
    );
  }

  if (user) {
    return (
      <div className="flex max-w-[min(100%,14rem)] items-center gap-2 sm:max-w-none sm:gap-3">
        <div className="flex min-w-0 items-center gap-2 text-sm text-sky-100/90">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full border border-sky-200/25 object-cover sm:h-8 sm:w-8"
            />
          ) : (
            <UserCircle className="h-9 w-9 shrink-0 text-sky-200/80 sm:h-8 sm:w-8" />
          )}
          <span className="hidden min-w-0 truncate font-medium sm:inline">
            {user.user_metadata?.full_name || "Usuário"}
          </span>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          className="h-11 w-11 shrink-0 touch-manipulation rounded-full text-sky-100 hover:bg-sky-400/15 sm:h-10 sm:w-10"
          title="Sair"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleLogin}
      className="h-11 touch-manipulation rounded-full border border-sky-200/25 bg-sky-400/15 px-4 text-sm font-medium text-sky-50 transition-colors hover:bg-sky-400/25 sm:h-10 sm:px-5"
    >
      Entrar com Google
    </Button>
  );
}
