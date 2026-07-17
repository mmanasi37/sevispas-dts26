import type { Metadata } from "next";
import { Inter, Noto_Sans, JetBrains_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const merriweatherHeading = Merriweather({ subsets: ['latin'], variable: '--font-heading' });

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "MIJOE - Microfinance Platform",
  description: "Empowering borrowers through SevisPass digital identity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(jetbrainsMono.variable, merriweatherHeading.variable, "font-sans", inter.variable)}>
      <body className={inter.className}>
        <AppProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>

          <Toaster />
        </AppProvider>
      </body>
    </html>
  )
}