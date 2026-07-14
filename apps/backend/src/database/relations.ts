import type { BorrowerTable, LoanApplicationTable, LoanRepaymentTable, StaffTable } from './schema.ts';

// Borrower with related loans
export interface BorrowerWithLoans extends BorrowerTable {
    loans: LoanApplicationTable[];
}

// Loan application with borrower and repayments
export interface LoanApplicationWithDetails extends LoanApplicationTable {
    borrower: BorrowerTable;
    repayments: LoanRepaymentTable[];
}

// Repayment with loan and borrower info
export interface RepaymentWithDetails extends LoanRepaymentTable {
    loan: LoanApplicationTable;
    borrower: BorrowerTable;
}

// Dashboard summary types
export interface BorrowerSummary {
    borrower: BorrowerTable;
    total_loans: number;
    total_borrowed: number;
    total_repaid: number;
    outstanding_balance: number;
    active_loans: number;
}

export interface LoanApplicationWithStatus extends LoanApplicationTable {
    borrower_name: string;
    borrower_email: string | null;
    total_repayments: number;
    amount_repaid: number;
    remaining_balance: number;
    repayment_status: 'all_paid' | 'partially_paid' | 'pending';
}