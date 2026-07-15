"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Circle, Calendar, AlertCircle } from "lucide-react";
import { KinaIcon } from "@/components/ui/kina-icon";
import { getBorrowerDashboard, getActiveLoan, sumAmount, getNextPayment } from "@/lib/api";

import { DEMO_SEVISPASS_ID } from "@/lib/utils";
import { formatFullDate, formatShortDate } from "@/lib/format";
import { BorrowerDashboard } from "@/lib/types";

export default function RepaymentSchedule() {
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
          Couldn&apos;t load repayment data: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-4 max-w-4xl mx-auto text-sm text-gray-500">Loading repayment schedule...</div>;
  }

  const activeLoan = getActiveLoan(data.applications);
  const repayments = activeLoan?.repayments ?? [];
  const totalRepaid = sumAmount(repayments.filter((r) => r.status === "paid"));
  const remaining = sumAmount(repayments.filter((r) => r.status !== "paid"));
  const nextPayment = getNextPayment(repayments);

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end items-center mb-6">
          <Badge variant="outline" className="text-sm">
            <KinaIcon className="h-3 w-3 mr-1" />
            Balance: K {remaining.toLocaleString()}
          </Badge>
        </div>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Repayment Schedule</CardTitle>
            <CardDescription>
              {activeLoan
                ? `Fortnightly repayment tracker for loan #${activeLoan.reference}, linked to your SevisPass ID`
                : "No loan repayments to track yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Repaid</p>
                <p className="text-2xl font-bold text-green-600">K {totalRepaid.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-blue-600">K {remaining.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Next Payment</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {nextPayment ? formatShortDate(nextPayment.due_date.toString()) : "—"}
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repayments.map((repayment) => (
                  <TableRow key={repayment.id}>
                    <TableCell className="font-medium">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      {formatFullDate(repayment.due_date)}
                    </TableCell>
                    <TableCell>K {repayment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {repayment.status === "paid" ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600">
                          <Circle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Digital Record
              </Badge>
              <span>Your repayment history is stored securely with your SevisPass ID</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
