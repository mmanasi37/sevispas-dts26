"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Users, FileText, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { KinaIcon } from "@/components/ui/kina-icon";

export default function StaffDashboard() {
  const stats = [
    { label: "New Applications", value: "24", icon: FileText, change: "+12%", trend: "up" },
    { label: "Pending Approvals", value: "18", icon: Clock, change: "-3%", trend: "down" },
    { label: "Active Loans", value: "142", icon: KinaIcon, change: "+8%", trend: "up" },
    { label: "Overdue Repayments", value: "7", icon: Users, change: "-2%", trend: "down" },
  ];

  const recentApplications = [
    { id: "APP-2024-01", borrower: "Sarah M.", amount: "K 3,000", date: "2 hours ago", status: "pending" },
    { id: "APP-2024-02", borrower: "Michael K.", amount: "K 5,000", date: "4 hours ago", status: "review" },
    { id: "APP-2024-03", borrower: "David L.", amount: "K 2,500", date: "Yesterday", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Loan officer overview</p>
          </div>
          <Badge variant="outline" className="text-sm">
            Last updated: Today, 10:30 AM
          </Badge>
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
                <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} from last week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>New applications awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{app.borrower}</p>
                      <p className="text-sm text-gray-500">{app.amount} • {app.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={app.status === "pending" ? "outline" : "default"}>
                        {app.status}
                      </Badge>
                      <Button size="sm" variant="ghost">Review</Button>
                    </div>
                  </div>
                ))}
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
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Mary P.</p>
                    <p className="text-sm text-gray-500">Due: 3 days ago • K 500</p>
                  </div>
                  <Button size="sm" variant="destructive">Follow Up</Button>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">James R.</p>
                    <p className="text-sm text-gray-500">Due: 5 days ago • K 750</p>
                  </div>
                  <Button size="sm" variant="destructive">Follow Up</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Anne K.</p>
                    <p className="text-sm text-gray-500">Due: 1 week ago • K 1,000</p>
                  </div>
                  <Button size="sm" variant="destructive">Follow Up</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
