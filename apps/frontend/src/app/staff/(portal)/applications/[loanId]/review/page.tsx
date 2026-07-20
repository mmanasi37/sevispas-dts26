"use client";

import { use, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { UserCheck, Shield, Calendar, Target, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { KinaIcon } from "@/components/ui/kina-icon";
import { toast } from 'sonner';
import { approveLoan, rejectLoan, getApplications } from "@/lib/api";
import { LoanApplication, ExistingLoanDeclaration } from "@/lib/types";
import { formatTerm, formatFullDate } from "@/lib/format";
import { initials } from "@/lib/utils";

export default function ApplicationReview({ params }: { params: Promise<{ loanId: string }> }) {
  const { loanId } = use(params);

  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [showReason, setShowReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    getApplications()
      .then((applications) => {
        const match = applications.find((app) => String(app.id) === loanId);
        if (!match) {
          setError("Application not found");
          return;
        }
        setApplication(match);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load application"))
      .finally(() => setLoading(false));
  }, [loanId]);

  const submitDecision = async () => {
    try {
      if (decision === "approve") {
        await approveLoan(Number(loanId), rejectionReason);
      } else {
        await rejectLoan(Number(loanId), rejectionReason);
      }
      toast.success(`Application ${decision}`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${decision} application`);
    }
  };

  if (loading) {
    return <div className="p-4 max-w-4xl mx-auto text-sm text-gray-500">Loading application...</div>;
  }

  if (error || !application) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error ?? "Application not found"}
        </div>
      </div>
    );
  }

  const borrower = application.borrower;
  const existingLoans: ExistingLoanDeclaration[] = application.existing_loans_json
    ? JSON.parse(application.existing_loans_json)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Application Review</h1>
          <Badge variant="outline">{application.reference}</Badge>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Loan Application #{application.reference}</CardTitle>
                  <CardDescription>Submitted {formatFullDate(application.submitted_at)}</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <Shield className="h-3 w-3 mr-1" />
                  SevisPass Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-brand-green-100 text-brand-green-600">
                      {initials(borrower.first_name, borrower.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{borrower.first_name} {borrower.last_name}</p>
                    <p className="text-sm text-gray-500">SevisPass ID: {borrower.sevispass_id}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Identity Verified
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <KinaIcon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Loan Amount</span>
                  </div>
                  <p className="text-2xl font-bold">K {Number(application.loan_amount).toLocaleString()}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Term</span>
                  </div>
                  <p className="text-2xl font-bold">{formatTerm(application.term)}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Loan Purpose</span>
                </div>
                <p className="capitalize">{application.purpose}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <p className="font-medium mb-1">Location</p>
                  <p className="text-sm text-gray-600">{borrower.village ?? "-"}, {borrower.province ?? "-"}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="font-medium mb-1">Employment</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {borrower.employment_status ?? "-"}
                    {borrower.monthly_income ? ` · K ${Number(borrower.monthly_income).toLocaleString()}/month` : ""}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <p className="font-medium mb-1">Existing Loans</p>
                {existingLoans.length ? (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {existingLoans.map((loan, i) => (
                      <li key={i}>{loan.lender} — K {Number(loan.amount).toLocaleString()}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">None declared</p>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <p className="font-medium mb-1">Disbursement</p>
                <p className="text-sm text-gray-600">
                  {application.disbursement_method === "bank_transfer" ? "Bank Transfer" : "Cash Pickup"}
                  {application.disbursement_details ? ` — ${application.disbursement_details}` : ""}
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-brand-green-50">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-brand-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-brand-green-700">SevisPass Verified Data</p>
                    <p className="text-sm text-brand-green-600">
                      Identity: {borrower.first_name} {borrower.last_name} · SevisPass ID: {borrower.sevispass_id} · Verified: Yes
                    </p>
                    {application.declared_at && (
                      <p className="text-xs text-brand-green-500 mt-1">
                        Digital declaration signed {formatFullDate(application.declared_at)} ({application.declaration_language === "tp" ? "Tok Pisin" : "English"})
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {showReason && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Decision</label>
                  <Textarea
                    placeholder="Enter reason for approval/rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => { setDecision("approve"); setShowReason(false) }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => { setDecision("reject"); setShowReason(true) }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>

              {decision && (
                <Button className="w-full" onClick={submitDecision}>Submit Decision</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
