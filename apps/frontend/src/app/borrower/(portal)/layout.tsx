"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Activity,
  Calendar,
  User,
  Shield,
  LogOut,
} from "lucide-react";
import ChacheChat from "@/components/ChacheChat";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button";
import LocaleSelector from "@/components/LocaleSelector";

const navItems = [
  { href: "/borrower/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/borrower/application", label: "Apply", icon: FileText },
  { href: "/borrower/status", label: "Status", icon: Activity },
  { href: "/borrower/repayment", label: "Repayments", icon: Calendar },
  { href: "/borrower/profile", label: "Profile", icon: User },
];

export default function BorrowerPortalLayout({
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
            <Link href="/borrower/dashboard" className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-bold">MIJOE</span>
              <Badge variant="outline" className="hidden sm:inline-flex text-xs">
                <Shield className="h-3 w-3 mr-1" />
                SevisPass
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

            <LocaleSelector />

            <div className="flex items-center gap-3 shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
              <Link
                href="/"
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
      <ChacheChat />
    </div>
  );
}
