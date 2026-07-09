"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Shield, TrendingUp } from "lucide-react";

export default function BorrowerProfile() {
  const loanHistory = [
    { date: "Jan 2024", amount: 5000, status: "active", repaid: 1000 },
    { date: "Oct 2023", amount: 2000, status: "completed", repaid: 2000 },
    { date: "Jun 2023", amount: 1500, status: "completed", repaid: 1500 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    JD
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-sm text-gray-500">SevisPass ID: SP-2024-001</p>
                <Badge className="mt-2" variant="outline">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Identity
                </Badge>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span>June 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Credit Score</span>
                  <span className="font-semibold text-green-600">720</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Borrowed</span>
                  <span>K 8,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Repayment Rate</span>
                  <span className="font-semibold text-green-600">98%</span>
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
                {loanHistory.map((loan, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Loan #{index + 1}</p>
                        <p className="text-sm text-gray-500">{loan.date}</p>
                      </div>
                      <Badge variant={loan.status === "active" ? "default" : "outline"}>
                        {loan.status === "active" ? "Active" : "Completed"}
                      </Badge>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <span className="ml-1 font-semibold">K {loan.amount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Repaid:</span>
                        <span className="ml-1 font-semibold">K {loan.repaid}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Progress:</span>
                        <span className="ml-1 font-semibold">
                          {Math.round((loan.repaid / loan.amount) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(loan.repaid / loan.amount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
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
