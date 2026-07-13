const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface Repayment {
  id: number;
  loan_application_id: number;
  due_date: string;
  amount: number;
  status: string;
  paid_at: string | null;
}

export interface LoanApplication {
  id: number;
  reference: string;
  borrower_id: number;
  amount: number;
  term: string;
  purpose: string;
  status: string;
  rejection_reason: string | null;
  submitted_at: string;
  decided_at: string | null;
  repayments: Repayment[];
}

export interface Borrower {
  id: number;
  sevispass_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  credit_score: number;
  member_since: string;
  created_at: string;
}

export interface BorrowerDashboard {
  borrower: Borrower;
  applications: LoanApplication[];
}

export async function getBorrowerDashboard(sevispassId: string): Promise<BorrowerDashboard> {
  const res = await fetch(`${API_URL}/api/borrowers/${sevispassId}/dashboard`);
  if (!res.ok) {
    throw new Error(`Failed to load borrower dashboard (${res.status})`);
  }
  return res.json();
}
