import { MarketingNav } from "@/components/marketing/MarketingNav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#030712] text-zinc-50 selection:bg-sky-500/30 selection:text-sky-50 leading-relaxed antialiased overflow-x-clip">
      <MarketingNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
