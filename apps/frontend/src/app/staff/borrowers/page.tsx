"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, User, AlertTriangle } from "lucide-react";
import { Borrower } from "@/lib/types";
import { getBorrowers } from "@/lib/api";
import Link from "next/link";

export default function BorrowerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);

  // const borrowers = [
  //   { id: 1, name: "Sarah M.", email: "sarah@email.com", loans: 3, status: "active", risk: "low", amount: 5000 },
  //   { id: 2, name: "Michael K.", email: "michael@email.com", loans: 2, status: "active", risk: "medium", amount: 4500 },
  //   { id: 3, name: "David L.", email: "david@email.com", loans: 1, status: "completed", risk: "low", amount: 2000 },
  //   { id: 4, name: "Mary P.", email: "mary@email.com", loans: 4, status: "overdue", risk: "high", amount: 3000 },
  //   { id: 5, name: "James R.", email: "james@email.com", loans: 2, status: "active", risk: "medium", amount: 6000 },
  // ];

  const filteredBorrowers = borrowers.filter(b =>
    b.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchBorrowers = async () => {
      const response = await getBorrowers();
      setBorrowers(response);
    };
    fetchBorrowers();
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
                  <TableHead>Status</TableHead>
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
                    <TableCell>{borrower?.loans}</TableCell>
                    <TableCell>K {borrower?.amount}</TableCell>
                    <TableCell>
                      <Badge variant={
                        borrower?.status === "active" ? "default" :
                          borrower?.status === "completed" ? "outline" :
                            "destructive"
                      }>
                        {borrower?.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={borrower?.risk === "low" ? "outline" : borrower?.risk === "medium" ? "default" : "destructive"}>
                        {borrower?.risk === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {borrower?.risk}
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
