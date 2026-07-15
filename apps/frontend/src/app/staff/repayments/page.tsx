"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, AlertCircle, CheckCircle } from "lucide-react";
import { KinaIcon } from "@/components/ui/kina-icon";
import { useEffect, useState } from "react";
import { getLoanRepayments } from "@/lib/api";
import { LoanRepayment } from "@/lib/types";

export default function RepaymentTracking() {
  // const repayments = [
  //   { borrower: "Sarah M.", amount: 500, due: "Feb 27, 2024", status: "upcoming" },
  //   { borrower: "Michael K.", amount: 750, due: "Feb 20, 2024", status: "overdue" },
  //   { borrower: "David L.", amount: 300, due: "Feb 15, 2024", status: "paid" },
  //   { borrower: "Mary P.", amount: 450, due: "Feb 10, 2024", status: "overdue" },
  //   { borrower: "James R.", amount: 600, due: "Feb 28, 2024", status: "upcoming" },
  // ];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [repayments, setRepayments] = useState<LoanRepayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoanRepayments();
  }, []);

  const fetchLoanRepayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLoanRepayments(1);
      setRepayments(data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Repayment Tracking</h1>
            <p className="text-gray-500">Fortnightly view of all active loans</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              2 Overdue
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              Automated Alerts Active
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Fortnight's Overview</CardTitle>
              <CardDescription>Repayments due in the current period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Paid</p>
                    <p className="text-2xl font-bold text-green-600">K 1,250</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">K 1,200</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Upcoming</p>
                    <p className="text-2xl font-bold text-blue-600">K 2,100</p>
                  </div>
                  <KinaIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Automated Alerts</CardTitle>
              <CardDescription>System-generated follow-up notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-red-500 bg-red-50 rounded">
                  <p className="font-medium text-sm">Mary P. - Overdue by 5 days</p>
                  <p className="text-xs text-gray-500">K 450 due • Sent 3 reminders</p>
                </div>
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                  <p className="font-medium text-sm">Michael K. - Due today</p>
                  <p className="text-xs text-gray-500">K 750 due • Reminder sent</p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <p className="font-medium text-sm">James R. - Due in 2 days</p>
                  <p className="text-xs text-gray-500">K 600 due • Pre-reminder sent</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Bulk Follow-ups
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Fortnightly Repayments</CardTitle>
            <CardDescription>Complete repayment schedule for all active loans</CardDescription>
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
                {repayments.map((repayment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{repayment.first_name} {repayment.last_name}</TableCell>
                    <TableCell>K {repayment.amount}</TableCell>
                    <TableCell>{repayment.due_date}</TableCell>
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
                      <Button size="sm" variant="ghost">Contact</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
