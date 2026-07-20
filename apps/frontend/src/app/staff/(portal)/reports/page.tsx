"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, PieChart, Users } from "lucide-react";

export default function Reports() {
  const reports = [
    { metric: "Disbursements", value: "K 245,000", change: "+15%", trend: "up" },
    { metric: "Collections", value: "K 198,500", change: "+12%", trend: "up" },
    { metric: "Repayment Rate", value: "81%", change: "+3%", trend: "up" },
    { metric: "Active Borrowers", value: "142", change: "+8%", trend: "up" },
  ];

  const trends = [
    { month: "Oct 2023", disbursements: 180000, collections: 145000, rate: 78 },
    { month: "Nov 2023", disbursements: 195000, collections: 158000, rate: 79 },
    { month: "Dec 2023", disbursements: 210000, collections: 172000, rate: 80 },
    { month: "Jan 2024", disbursements: 245000, collections: 198500, rate: 81 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-gray-500">Impact data for Grand Final presentation</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size={'sm'}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Badge variant="outline">
              Grand Final Ready
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {reports.map((report) => (
            <Card className="shadow-none" key={report.metric}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{report.metric}</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.value}</div>
                <p className="text-xs text-green-600">{report.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Monthly Trends
              </CardTitle>
              <CardDescription>Disbursements, collections, and repayment rates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Disbursements</TableHead>
                    <TableHead>Collections</TableHead>
                    <TableHead>Repayment Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trends.map((trend) => (
                    <TableRow key={trend.month}>
                      <TableCell className="font-medium">{trend.month}</TableCell>
                      <TableCell>K {trend.disbursements.toLocaleString()}</TableCell>
                      <TableCell>K {trend.collections.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={trend.rate >= 80 ? "default" : "outline"}>
                          {trend.rate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Borrower Demographics
              </CardTitle>
              <CardDescription>Key insights for impact reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Business</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-brand-green-600 h-2 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Education</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "25%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Housing</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "20%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Medical</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-700">Grand Final Impact</p>
                    <p className="text-sm text-green-600">
                      142 active borrowers • 81% repayment rate • K 245,000 disbursed •
                      Building financial inclusion through digital identity
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
