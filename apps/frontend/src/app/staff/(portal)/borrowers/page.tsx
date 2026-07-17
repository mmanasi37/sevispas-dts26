"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, User, AlertTriangle } from "lucide-react";
import { Borrower } from "@/lib/types";
import { getBorrowers, getApplications } from "@/lib/api";
import { creditScoreRisk } from "@/lib/utils";
import Link from "next/link";

interface BorrowerRow extends Borrower {
  loanCount: number;
  totalBorrowed: number;
  risk: "low" | "medium" | "high";
}

export default function BorrowerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [borrowers, setBorrowers] = useState<BorrowerRow[]>([]);

  const filteredBorrowers = borrowers.filter(b =>
    b.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    Promise.all([getBorrowers(), getApplications()]).then(([allBorrowers, applications]) => {
      setBorrowers(allBorrowers.map((borrower) => {
        const theirApplications = applications.filter((app) => app.borrower_id === borrower.id);
        return {
          ...borrower,
          loanCount: theirApplications.length,
          totalBorrowed: theirApplications
            .filter((app) => app.status === "approved")
            .reduce((sum, app) => sum + Number(app.loan_amount), 0),
          risk: creditScoreRisk(borrower.credit_score),
        };
      }));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Borrower Management</h1>
            <p className="text-gray-500">Full list of all borrowers</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">Total: {borrowers.length}</Badge>
            {/* <Badge variant="outline">Active: {borrowers.filter(b => b.status === "active").length}</Badge> */}
          </div>
        </div>

        <Card className="shadow-none">
          <CardHeader>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Loans</TableHead>
                  <TableHead>Total Borrowed</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Risk</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBorrowers.map((borrower) => (
                  <TableRow key={borrower?.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{borrower?.first_name} {borrower?.last_name}</p>
                          <p className="text-sm text-gray-500">{borrower?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{borrower.loanCount}</TableCell>
                    <TableCell>K {borrower.totalBorrowed.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={borrower.risk === "low" ? "outline" : borrower.risk === "medium" ? "default" : "destructive"}>
                        {borrower.risk === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {borrower.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/staff/borrowers/${borrower?.id}`} className={`${buttonVariants({ variant: "outline" })}`}>View Details</Link>
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
