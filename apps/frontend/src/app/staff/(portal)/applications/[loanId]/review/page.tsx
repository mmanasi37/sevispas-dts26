"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { UserCheck, Shield, Calendar, Target, CheckCircle, XCircle } from "lucide-react";
import { KinaIcon } from "@/components/ui/kina-icon";
import { toast } from 'sonner';
import { approveLoan, rejectLoan } from "@/lib/api";

export default function ApplicationReview({ loanId }: { loanId: string }) {
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [showReason, setShowReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Application Review</h1>
          <Badge variant="outline">1 of 18 pending</Badge>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Loan Application #APP-2024-001</CardTitle>
                  <CardDescription>Submitted 2 hours ago</CardDescription>
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
                    <AvatarFallback className="bg-blue-100 text-blue-600">SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Sarah M.</p>
                    <p className="text-sm text-gray-500">SevisPass ID: SP-2024-045</p>
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
                  <p className="text-2xl font-bold">K 3,000</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Term</span>
                  </div>
                  <p className="text-2xl font-bold">Short Term</p>
                  <p className="text-sm text-gray-500">5 fortnights</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Loan Purpose</span>
                </div>
                <p>Business - Small retail shop expansion</p>
              </div>

              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-700">SevisPass Verified Data</p>
                    <p className="text-sm text-blue-600">
                      Identity: Sarah M. • Age: 32 • Location: Port Moresby • Verified: Yes
                    </p>
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
