export interface User {
  id: string;
  name: string;
  email: string;
  sevispassId: string;
  verified: boolean;
}

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  term: 'short' | 'long';
  purpose: string;
  status: 'pending' | 'review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Repayment {
  id: string;
  loanId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidAt?: string;
}

export interface Borrower {
  id: string;
  name: string;
  email: string;
  sevispassId: string;
  memberSince: string;
  creditScore: number;
  totalBorrowed: number;
  repaymentRate: number;
  status: 'active' | 'completed' | 'overdue';
}
