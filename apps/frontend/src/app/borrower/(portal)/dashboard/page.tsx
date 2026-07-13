"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Calendar,
  CheckCircle,
  FileText,
  Activity,
  User,
  ArrowRight,
} from "lucide-react";
import { KinaIcon } from "@/components/ui/kina-icon";

export default function BorrowerDashboard() {
  const stats = [
    { label: "Active Loan Balance", value: "K 2,500", icon: KinaIcon },
    { label: "Credit Score", value: "720", icon: TrendingUp },
    { label: "Next Payment", value: "K 500 · Feb 27", icon: Calendar },
    { label: "Repayment Rate", value: "98%", icon: CheckCircle },
  ];

  const quickActions = [
    {
      href: "/borrower/application",
      label: "Apply for a New Loan",
      description: "Submit a new loan request",
      icon: FileText,
    },
    {
      href: "/borrower/status",
      label: "Track Application Status",
      description: "See where your application stands",
      icon: Activity,
    },
    {
      href: "/borrower/repayment",
      label: "View Repayment Schedule",
      description: "Check upcoming and past payments",
      icon: Calendar,
    },
    {
      href: "/borrower/profile",
      label: "View Profile",
      description: "Your SevisPass identity & loan history",
      icon: User,
    },
  ];

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome back, John</h1>
          <p className="text-gray-500">Here&apos;s an overview of your account</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Current Loan</CardTitle>
                  <CardDescription>Application #MIJ-2024-001</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-700">Approved</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-medium">K 5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Term</span>
                  <span className="font-medium">Short Term (5 fortnights)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Purpose</span>
                  <span className="font-medium">Business</span>
                </div>
              </div>
              <Link href="/borrower/status">
                <Button variant="outline" className="w-full">
                  View Full Status
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump to what you need</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-50">
                        <action.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{action.label}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
