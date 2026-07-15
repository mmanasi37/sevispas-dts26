"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoanApplication } from "@/lib/types";
import { getApplications } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ApplicationsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [applications, setApplications] = useState<LoanApplication[]>([]);

    const filteredApplications = applications;

    // const filteredApplications = applications.filter((app) => {
    //     const matchesSearch =
    //         app.borrower?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         app.borrower?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    //     // || app.id.includes(searchTerm.toLowerCase());
    //     const matchesStatus = statusFilter === "All"// || app.status == statusFilter;
    //     return matchesSearch && matchesStatus;
    // });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Pending":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 font-normal">Pending</Badge>;
            case "Review":
                return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-normal">Review</Badge>;
            case "Approved":
                return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 font-normal">Approved</Badge>;
            case "Rejected":
                return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 font-normal">Rejected</Badge>;
            default:
                return <Badge variant="outline">Pending</Badge>;
        }
    };

    useEffect(() => {
        const fetchApplications = async () => {
            const applications = await getApplications();
            setApplications(applications);
        };
        fetchApplications();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-bold">My Loan Applications</h1>
                        <p className="text-gray-500">View and manage all loan applications.</p>
                    </div>
                </div>

                {/* Filters and Table in a minimal Card */}
                <Card className="shadow-none">
                    <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by ID or Borrower..."
                                className="pl-9 w-full bg-gray-50/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex w-full sm:w-auto items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as string)}>
                                <SelectTrigger className="w-[160px] bg-gray-50/50">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Statuses</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Review">Review</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 border-t">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="pl-6">Application ID</TableHead>
                                    <TableHead>Borrower</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Term</TableHead>
                                    <TableHead>Date Submitted</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map((app, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="pl-6 font-medium text-gray-900">{app.reference}</TableCell>
                                            <TableCell className="text-gray-600">{app.borrower.first_name} {app.borrower.last_name}</TableCell>
                                            <TableCell>{app.loan_amount}</TableCell>
                                            <TableCell className="text-gray-500">{app.term}</TableCell>
                                            <TableCell className="text-gray-500">{app.application_date.toString()}</TableCell>
                                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Link href={`/staff/applications/${app.id}/review`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), `h-8 w-8 p-0`)} title="View Application">
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                            No applications found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}