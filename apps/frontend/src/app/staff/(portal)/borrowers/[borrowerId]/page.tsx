"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, AlertTriangle, Shield } from "lucide-react";
import { getBorrowers, getApplications } from "@/lib/api";
import { Borrower, LoanApplication } from "@/lib/types";
import { creditScoreRisk, initials } from "@/lib/utils";
import { formatFullDate, formatTerm } from "@/lib/format";

export default function BorrowerDetailsPage({ params }: { params: Promise<{ borrowerId: string }> }) {
  const { borrowerId } = use(params);

  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getBorrowers(), getApplications()])
      .then(([borrowers, allApplications]) => {
        const match = borrowers.find((b) => String(b.id) === borrowerId);
        if (!match) {
          setError("Borrower not found");
          return;
        }
        setBorrower(match);
        setApplications(allApplications.filter((app) => app.borrower_id === match.id));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load borrower"))
      .finally(() => setLoading(false));
  }, [borrowerId]);

  if (loading) {
    return <div className="p-4 max-w-5xl mx-auto text-sm text-gray-500">Loading borrower...</div>;
  }

  if (error || !borrower) {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error ?? "Borrower not found"}
        </div>
      </div>
    );
  }

  const risk = creditScoreRisk(borrower.credit_score);
  const totalBorrowed = applications
    .filter((app) => app.status === "approved")
    .reduce((sum, app) => sum + Number(app.loan_amount), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <Card className="shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-brand-green-100 text-brand-green-600">
                    {initials(borrower.first_name, borrower.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{borrower.first_name} {borrower.last_name}</CardTitle>
                  <CardDescription>{borrower.borrower_number} · Member since {formatFullDate(borrower.member_since)}</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                SevisPass Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">SevisPass ID</p>
                <p className="font-medium break-all">{borrower.sevispass_id}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{borrower.email}</p>
                <p className="text-sm text-gray-500">{borrower.phone_number ?? "No phone on file"}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{borrower.village ?? "-"}, {borrower.province ?? "-"}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Employment</p>
                <p className="font-medium capitalize">{borrower.employment_status ?? "-"}</p>
                {borrower.monthly_income && (
                  <p className="text-sm text-gray-500">K {Number(borrower.monthly_income).toLocaleString()}/month</p>
                )}
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Credit Score</p>
                <p className="font-medium">{borrower.credit_score}</p>
                <Badge variant={risk === "low" ? "outline" : risk === "medium" ? "default" : "destructive"} className="mt-1">
                  {risk === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {risk} risk
                </Badge>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Borrowed (Approved)</p>
                <p className="font-medium">K {totalBorrowed.toLocaleString()} · {applications.length} application{applications.length === 1 ? "" : "s"} total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Loan Applications</CardTitle>
          </CardHeader>
          <CardContent className="p-0 border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right pr-6">Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length ? (
                  applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="pl-6 font-medium">{app.reference}</TableCell>
                      <TableCell>K {Number(app.loan_amount).toLocaleString()}</TableCell>
                      <TableCell>{formatTerm(app.term)}</TableCell>
                      <TableCell className="capitalize">{app.purpose}</TableCell>
                      <TableCell>{formatFullDate(app.submitted_at)}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Link href={`/staff/applications/${app.id}/review`} className="text-brand-green-600 hover:underline text-sm">
                          Review
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                      No applications yet.
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
