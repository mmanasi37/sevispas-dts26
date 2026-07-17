"use client";

import { useEffect, useState } from "react";
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
  AlertCircle,
} from "lucide-react";
import { KinaIcon } from "@/components/ui/kina-icon";
import { getBorrowerDashboard, getActiveLoan, sumAmount, getNextPayment } from "@/lib/api";

import { getCurrentSevispassId } from "@/server/actions";
import { formatTerm, formatShortDate } from "@/lib/format";
import { BorrowerDashboard } from "@/lib/types";

const quickActions = [
  {
    href: "/borrower/apply",
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

export default function BorrowerDashboardPage() {
  const [data, setData] = useState<BorrowerDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentSevispassId()
      .then(getBorrowerDashboard)
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          Couldn&apos;t load dashboard data: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-4 max-w-7xl mx-auto text-sm text-gray-500">Loading dashboard...</div>;
  }

  const { borrower, applications } = data;
  const activeLoan = getActiveLoan(applications);
  const allRepayments = applications.flatMap((app) => app.repayments);
  const paidRepayments = allRepayments.filter((r) => r.status === "paid");
  const repaymentRate = allRepayments.length
    ? Math.round((paidRepayments.length / allRepayments.length) * 100)
    : 0;

  const activeLoanBalance = activeLoan ? sumAmount(activeLoan.repayments.filter((r) => r.status !== "paid")) : 0;
  const nextPayment = activeLoan ? getNextPayment(activeLoan.repayments) : undefined;

  const stats = [
    { label: "Active Loan Balance", value: `K ${activeLoanBalance.toLocaleString()}`, icon: KinaIcon },
    { label: "Credit Score", value: String(borrower.credit_score), icon: TrendingUp },
    {
      label: "Next Payment",
      value: nextPayment ? `K ${nextPayment.amount.toLocaleString()} · ${formatShortDate(nextPayment.due_date.toString())}` : "None due",
      icon: Calendar,
    },
    { label: "Repayment Rate", value: `${repaymentRate}%`, icon: CheckCircle },
  ];

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome back, {borrower.first_name}</h1>
          <p className="text-gray-500">Here&apos;s an overview of your account</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats.map((stat) => (
            <Card className="shadow-none" key={stat.label}>
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
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Current Loan</CardTitle>
                  <CardDescription>
                    {activeLoan ? `Application #${activeLoan.reference}` : "No loans yet"}
                  </CardDescription>
                </div>
                {activeLoan && (
                  <Badge className="bg-green-100 text-green-700 capitalize">{activeLoan.status}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {activeLoan ? (
                <>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-medium">K {activeLoan.loan_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Term</span>
                      <span className="font-medium">{formatTerm(activeLoan.term)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Purpose</span>
                      <span className="font-medium capitalize">{activeLoan.purpose}</span>
                    </div>
                  </div>
                  <Link href="/borrower/status">
                    <Button variant="outline" className="w-full">
                      View Full Status
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/borrower/apply">
                  <Button className="w-full">Apply for Your First Loan</Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none">
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
