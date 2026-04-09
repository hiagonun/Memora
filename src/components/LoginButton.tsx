"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { User as AuthUser } from "@supabase/supabase-js";
import { LogOut, UserCircle } from "lucide-react";

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
    const isConfigMissing = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co";
    
    if (isConfigMissing) {
      alert("Configure as credenciais do Supabase no arquivo .env (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY) para testar o login.");
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // We request calendar.events scope to be able to create events later
        scopes: "https://www.googleapis.com/auth/calendar.events",
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : "/",
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="w-24 h-10 animate-pulse bg-white/10 rounded-full" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-white/20"
            />
          ) : (
            <UserCircle className="w-8 h-8" />
          )}
          <span className="hidden sm:inline-block font-medium">
            {user.user_metadata?.full_name || "Usuário"}
          </span>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleLogin}
      className="rounded-full bg-white/20 hover:bg-white/30 text-slate-800 dark:text-white border border-white/30 backdrop-blur-md shadow-sm transition-all"
    >
      Entrar com Google
    </Button>
  );
}
