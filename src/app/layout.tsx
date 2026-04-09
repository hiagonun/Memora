import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LiquidGlassBackground } from "@/components/LiquidGlassBackground";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memora | Spaced Repetition",
  description: "Organize suas revisões com base na Curva do Esquecimento",
};

import { NavBar } from "@/components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col relative font-sans text-slate-900 dark:text-slate-100 placeholder:text-slate-500 pt-20" suppressHydrationWarning>
        <LiquidGlassBackground />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
