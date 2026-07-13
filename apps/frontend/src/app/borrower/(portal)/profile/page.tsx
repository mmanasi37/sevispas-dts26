"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, TrendingUp, AlertCircle } from "lucide-react";
import { getBorrowerDashboard, type BorrowerDashboard } from "@/lib/api";
import { DEMO_SEVISPASS_ID, initials } from "@/lib/session";
import { formatMonthYear, formatMonthShort } from "@/lib/format";

export default function BorrowerProfile() {
  const [data, setData] = useState<BorrowerDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBorrowerDashboard(DEMO_SEVISPASS_ID)
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          Couldn&apos;t load profile data: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-4 max-w-4xl mx-auto text-sm text-gray-500">Loading profile...</div>;
  }

  const { borrower, applications } = data;

  const totalBorrowed = applications.reduce((sum, app) => sum + app.amount, 0);
  const allRepayments = applications.flatMap((app) => app.repayments);
  const paidRepayments = allRepayments.filter((r) => r.status === "paid");
  const repaymentRate = allRepayments.length
    ? Math.round((paidRepayments.length / allRepayments.length) * 100)
    : 0;

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {initials(borrower.first_name, borrower.last_name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">
                  {borrower.first_name} {borrower.last_name}
                </h2>
                <p className="text-sm text-gray-500">SevisPass ID: {borrower.sevispass_id}</p>
                <Badge className="mt-2" variant="outline">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Identity
                </Badge>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span>{formatMonthYear(borrower.member_since)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Credit Score</span>
                  <span className="font-semibold text-green-600">{borrower.credit_score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Borrowed</span>
                  <span>K {totalBorrowed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Repayment Rate</span>
                  <span className="font-semibold text-green-600">{repaymentRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Loan History</CardTitle>
              <CardDescription>
                Your complete credit record tied to your SevisPass identity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((loan, index) => {
                  const repaid = loan.repayments
                    .filter((r) => r.status === "paid")
                    .reduce((sum, r) => sum + r.amount, 0);
                  const isActive = loan.repayments.some((r) => r.status !== "paid");
                  const progress = Math.round((repaid / loan.amount) * 100);

                  return (
                    <div key={loan.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Loan #{index + 1}</p>
                          <p className="text-sm text-gray-500">{formatMonthShort(loan.submitted_at)}</p>
                        </div>
                        <Badge variant={isActive ? "default" : "outline"}>
                          {isActive ? "Active" : "Completed"}
                        </Badge>
                      </div>
                      <div className="mt-2 flex gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <span className="ml-1 font-semibold">K {loan.amount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Repaid:</span>
                          <span className="ml-1 font-semibold">K {repaid.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Progress:</span>
                          <span className="ml-1 font-semibold">{progress}%</span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Your digital credit file is growing. The longer you use MIJOE, the richer this gets.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
