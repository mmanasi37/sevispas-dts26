import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}