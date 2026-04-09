"use client";

import { useEffect, useState, type ReactNode } from "react";
import { User as AuthUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { MemoraLogo } from "@/components/MemoraLogo";
import { NavBar } from "@/components/NavBar";
import { toast } from "sonner";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
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
      setLoading(false);
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
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard",
      },
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-[100dvh] w-full items-center justify-center px-4">
        <div className="h-12 w-40 animate-pulse rounded-full bg-sky-400/10" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[100dvh] w-full items-center justify-center px-4">
        <GlassCard className="w-full max-w-md p-8 text-center sm:p-10">
          <div className="mb-5 flex items-center justify-center gap-3">
            <MemoraLogo variant="navbar" href={null} iconOnly />
            <span className="text-2xl font-semibold tracking-tight text-sky-50">Memora</span>
          </div>
          <h1 className="mb-2 text-xl font-medium text-sky-50 sm:text-2xl">Entrar para continuar</h1>
          <p className="mb-6 text-sm leading-relaxed text-sky-200/70 sm:text-base">
            Faça login com Google para acessar seus estudos e sincronizar as revisoes.
          </p>
          <Button
            onClick={handleLogin}
            className="h-11 w-full rounded-full bg-sky-400 text-sky-950 transition-colors hover:bg-sky-300"
          >
            Entrar com Google
          </Button>
        </GlassCard>
      </main>
    );
  }

  return (
    <>
      <NavBar />
      <div className="flex flex-1 flex-col pt-[calc(5.25rem+env(safe-area-inset-top,0px))]">
        {children}
      </div>
    </>
  );
}
