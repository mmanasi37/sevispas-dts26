"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Circle, Calendar, DollarSign } from "lucide-react";

export default function RepaymentSchedule() {
  const repayments = [
    { due: "January 30, 2024", amount: 500, status: "paid" },
    { due: "February 13, 2024", amount: 500, status: "paid" },
    { due: "February 27, 2024", amount: 500, status: "pending" },
    { due: "March 12, 2024", amount: 500, status: "pending" },
    { due: "March 26, 2024", amount: 500, status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">MIJOE</h1>
          <Badge variant="outline" className="text-sm">
            <DollarSign className="h-3 w-3 mr-1" />
            Balance: K 2,500
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Repayment Schedule</CardTitle>
            <CardDescription>
              Your fortnightly repayment tracker linked to your SevisPass ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Repaid</p>
                <p className="text-2xl font-bold text-green-600">K 1,000</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-blue-600">K 2,500</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Next Payment</p>
                <p className="text-2xl font-bold text-yellow-600">Feb 27</p>
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
                {repayments.map((repayment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      {repayment.due}
                    </TableCell>
                    <TableCell>K {repayment.amount}</TableCell>
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
