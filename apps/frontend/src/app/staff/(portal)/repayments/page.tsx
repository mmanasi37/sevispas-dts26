"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle } from "lucide-react";
import { KinaIcon } from "@/components/ui/kina-icon";
import { useEffect, useState } from "react";
import { getApplications } from "@/lib/api";
import { formatFullDate } from "@/lib/format";

interface RepaymentRow {
  id: number;
  first_name: string;
  last_name: string;
  amount: number;
  due_date: string;
  status: string;
}

export default function RepaymentTracking() {
  const [repayments, setRepayments] = useState<RepaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getApplications()
      .then((applications) => {
        const allRepayments = applications.flatMap((app) =>
          app.repayments.map((r) => ({
            id: r.id,
            first_name: app.borrower.first_name,
            last_name: app.borrower.last_name,
            amount: Number(r.amount),
            due_date: r.due_date,
            status: r.status,
          }))
        );
        setRepayments(allRepayments);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to fetch repayments"))
      .finally(() => setLoading(false));
  }, []);

  const paidTotal = repayments.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.amount, 0);
  const overdue = repayments.filter((r) => r.status === "overdue");
  const overdueTotal = overdue.reduce((sum, r) => sum + r.amount, 0);
  const pendingTotal = repayments.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Repayment Tracking</h1>
            <p className="text-gray-500">Repayment schedule across all loans</p>
          </div>
          {overdue.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {overdue.length} Overdue
            </Badge>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Repayment Summary</CardTitle>
            <CardDescription>Across all borrowers, all statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Paid</p>
                  <p className="text-2xl font-bold text-green-600">K {paidTotal.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">K {overdueTotal.toLocaleString()}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Pending</p>
                  <p className="text-2xl font-bold text-blue-600">K {pendingTotal.toLocaleString()}</p>
                </div>
                <KinaIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none mt-6">
          <CardHeader>
            <CardTitle>All Repayments</CardTitle>
            <CardDescription>Complete repayment schedule across all loans</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">Loading...</TableCell>
                  </TableRow>
                ) : repayments.length ? (
                  repayments.map((repayment) => (
                    <TableRow key={repayment.id}>
                      <TableCell className="font-medium">{repayment.first_name} {repayment.last_name}</TableCell>
                      <TableCell>K {repayment.amount.toLocaleString()}</TableCell>
                      <TableCell>{formatFullDate(repayment.due_date)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          repayment.status === "paid" ? "outline" :
                            repayment.status === "overdue" ? "destructive" :
                              "default"
                        }>
                          {repayment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size='sm'>Contact</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No repayments yet — schedules are generated once a loan application is approved.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
