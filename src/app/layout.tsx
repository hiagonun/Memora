import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

import { NavBar } from "@/components/NavBar";

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full min-h-[100dvh] flex flex-col relative font-sans text-foreground bg-background placeholder:text-muted-foreground pt-[calc(5.25rem+env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)] selection:bg-sky-400/30 selection:text-sky-50" suppressHydrationWarning>
        <NavBar />
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
