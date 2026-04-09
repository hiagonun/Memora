import { AuthGate } from "@/components/AuthGate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-[100dvh] flex flex-col bg-background text-foreground">
      <AuthGate>{children}</AuthGate>
    </div>
  );
}
