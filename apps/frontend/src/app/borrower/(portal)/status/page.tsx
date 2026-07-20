"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { getBorrowerDashboard } from "@/lib/api";

import { getCurrentSevispassId } from "@/server/actions";
import { formatFullDate, formatTerm } from "@/lib/format";
import { BorrowerDashboard, ELoanApplicationStatus } from "@/lib/types";

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    label: "Pending",
    description: "Your application is in the queue and will be reviewed shortly.",
  },
  review: {
    icon: RefreshCw,
    color: "text-brand-green-600",
    bgColor: "bg-brand-green-100",
    label: "Under Review",
    description: "A loan officer is currently reviewing your application.",
  },
  approved: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    label: "Approved",
    description: "Congratulations! Your loan has been approved.",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "Rejected",
    description: "We regret to inform you that your application was not approved.",
  },
} as const;

export default function LoanStatus() {
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
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          Couldn&apos;t load application status: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-4 max-w-2xl mx-auto text-sm text-gray-500">Loading status...</div>;
  }

  // Applications come back newest-first, so the first one is whatever was most recently submitted.
  const latest = data.applications[0];

  if (!latest) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <Card className="shadow-none">
          <CardContent className="pt-6 text-center text-sm text-gray-500">
            You haven&apos;t applied for a loan yet.
            <Button className="mt-4 w-full" onClick={() => (window.location.href = "/borrower/apply")}>
              Apply Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStatus = statusConfig[latest.status as unknown as keyof typeof statusConfig] ?? statusConfig.pending;

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-6">
          <Button variant="outline" onClick={() => (window.location.href = "/borrower/apply")}>
            New Application
          </Button>
        </div>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Loan Application Status</CardTitle>
            <CardDescription>Real-time tracking of your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${currentStatus.bgColor}`}>
                  <currentStatus.icon className={`h-6 w-6 ${currentStatus.color}`} />
                </div>
                <div>
                  <p className="font-semibold">{currentStatus.label}</p>
                  <p className="text-sm text-gray-600">{currentStatus.description}</p>
                </div>
              </div>
              <Badge variant="outline">Application #{latest.reference}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Submitted</span>
                <span>{formatFullDate(String(latest.submitted_at))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Loan Amount</span>
                <span>K {latest.loan_amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Term</span>
                <span>{formatTerm(latest.term)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Purpose</span>
                <span className="capitalize">{latest.purpose}</span>
              </div>
            </div>

            {latest.status === ELoanApplicationStatus.REJECTED && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700">Reason for Rejection</p>
                    <p className="text-sm text-red-600">
                      {latest.rejection_reason ?? "No reason provided."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {latest.status === ELoanApplicationStatus.APPROVED && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  Your loan has been approved! You can now view your repayment schedule.
                </p>
                <Button
                  className="mt-3"
                  onClick={() => (window.location.href = "/borrower/repayment")}
                >
                  View Repayment Schedule
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
