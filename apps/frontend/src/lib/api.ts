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

// The loan currently being paid off — the one with at least one non-paid repayment.
// Falls back to the most recently submitted loan if every loan is fully repaid.
export function getActiveLoan(applications: LoanApplication[]): LoanApplication | undefined {
  return (
    applications.find((app) => app.repayments.some((r) => r.status !== "paid")) ?? applications[0]
  );
}

export function sumAmount(repayments: Repayment[]) {
  return repayments.reduce((sum, r) => sum + r.amount, 0);
}

export function getNextPayment(repayments: Repayment[]): Repayment | undefined {
  return repayments
    .filter((r) => r.status !== "paid")
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
}
