import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthGate } from "@/components/AuthGate";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memora | Spaced Repetition",
  description: "Organize suas revisões com base na Curva do Esquecimento",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.09 0.035 250)" },
  ],
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full min-h-[100dvh] flex flex-col relative font-sans text-foreground bg-background placeholder:text-muted-foreground pb-[env(safe-area-inset-bottom,0px)] selection:bg-sky-400/30 selection:text-sky-50" suppressHydrationWarning>
        <AuthGate>{children}</AuthGate>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
