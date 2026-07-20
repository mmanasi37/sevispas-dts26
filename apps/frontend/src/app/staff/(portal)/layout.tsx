"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  NotebookText,
  Users,
  Coins,
  ChartBar,
  Shield,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff/applications", label: "Applications", icon: NotebookText },
  { href: "/staff/borrowers", label: "Borrowers", icon: Users },
  { href: "/staff/repayments", label: "Repayments", icon: Coins },
  { href: "/staff/reports", label: "Reports", icon: ChartBar },
];

export default function StaffPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/staff/dashboard" className="flex items-center gap-2 shrink-0">
              <Logo size="sm" animate href={null} />
              <span className="text-xl font-bold">MIJOE</span>
              <Badge variant="outline" className="hidden sm:inline-flex text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Staff Portal
              </Badge>
            </Link>

            <nav className="flex items-center gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                      active
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  ST
                </AvatarFallback>
              </Avatar>
              <Link
                href="/staff/login"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
