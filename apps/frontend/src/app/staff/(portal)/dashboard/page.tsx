import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { FileText, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { KinaIcon } from "@/components/ui/kina-icon";
import { getApplications } from "@/lib/api";
import { formatShortDate } from "@/lib/format";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default async function StaffDashboard() {
  const applications = await getApplications();

  const newThisWeek = applications.filter(
    (app) => Date.now() - new Date(app.submitted_at).getTime() < SEVEN_DAYS_MS
  ).length;
  const pendingApprovals = applications.filter((app) => !app.decided_at).length;
  const activeLoans = applications.filter((app) => app.status === "approved").length;

  const overdueRepayments = applications.flatMap((app) =>
    app.repayments
      .filter((r) => r.status === "overdue")
      .map((r) => ({
        borrower: `${app.borrower.first_name} ${app.borrower.last_name}`,
        amount: Number(r.amount),
        due_date: r.due_date,
      }))
  );

  const stats = [
    { label: "New Applications (7d)", value: newThisWeek, icon: FileText },
    { label: "Pending Approvals", value: pendingApprovals, icon: Clock },
    { label: "Active Loans", value: activeLoans, icon: KinaIcon },
    { label: "Overdue Repayments", value: overdueRepayments.length, icon: AlertCircle },
  ];

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Loan officer overview</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-none">
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
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Most recently submitted applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length ? (
                  recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">{app.borrower.first_name} {app.borrower.last_name}</p>
                        <p className="text-sm text-gray-500">K {Number(app.loan_amount).toLocaleString()} • {formatShortDate(app.submitted_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{app.status ?? "pending"}</Badge>
                        <Link href={`/staff/applications/${app.id}/review`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>Review</Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No applications yet.</p>
                )}
              </div>
              <Link href={"/staff/applications"} className={cn(buttonVariants({ variant: 'link' }), "w-full mt-4")}>View All Applications</Link>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Overdue Repayments</CardTitle>
              <CardDescription>Borrowers with overdue payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueRepayments.length ? (
                  overdueRepayments.map((r, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">{r.borrower}</p>
                        <p className="text-sm text-gray-500">Due: {formatShortDate(r.due_date)} • K {r.amount.toLocaleString()}</p>
                      </div>
                      <Button size="sm" variant="destructive">Follow Up</Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No overdue repayments.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
