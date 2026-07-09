"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function LoanStatus() {
  const [status, setStatus] = useState<"pending" | "review" | "approved" | "rejected">("pending");

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
      color: "text-blue-600",
      bgColor: "bg-blue-100",
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
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">MIJOE</h1>
          <Button variant="outline" onClick={() => window.location.href = "/borrower/application"}>
            New Application
          </Button>
        </div>

        <Card>
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
              <Badge variant="outline">Application #MIJ-2024-001</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Submitted</span>
                <span>January 15, 2024 - 10:30 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Loan Amount</span>
                <span>K 5,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Term</span>
                <span>Short Term (5 fortnights)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Purpose</span>
                <span>Business</span>
              </div>
            </div>

            {status === "rejected" && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700">Reason for Rejection</p>
                    <p className="text-sm text-red-600">
                      Insufficient credit history. We recommend building credit through smaller loans first.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {status === "approved" && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  Your loan has been approved! You can now view your repayment schedule.
                </p>
                <Button
                  className="mt-3"
                  onClick={() => window.location.href = "/borrower/repayment"}
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
