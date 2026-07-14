import { Borrower, BorrowerDashboard, ERepaymentStatus, LoanApplication, NewLoanApplicationInput, LoanRepayment } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function createApi(url: string, options?: RequestInit) {
  const opts = Object.assign({
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }, options);
  const res = await fetch(`${API_URL}/api/${url}`, opts);

  if (!res.ok) {
    throw new Error(`Failed to fetch data (${res.status})`);
  }

  return res.json();
}

export async function getBorrowerDashboard(sevispassId: string): Promise<BorrowerDashboard> {
  const api = await createApi(`/borrowers/${sevispassId}/dashboard`);
  return api;
}

export async function createLoanApplication(
  sevispassId: string,
  input: NewLoanApplicationInput
): Promise<LoanApplication> {
  try {
    const res = await createApi(`/borrowers/${sevispassId}/applications`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    return res;
  } catch (error) {
    console.error("Failed to submit application:", error);
    throw error;
  }
}

// The loan currently being paid off — the one with at least one non-paid repayment.
// Falls back to the most recently submitted loan if every loan is fully repaid.
export function getActiveLoan(applications: LoanApplication[]): LoanApplication | undefined {
  return applications.find((app) => app.repayments.some((r) => r.status !== ERepaymentStatus.PAID)) ?? applications[0];
}

export function sumAmount(repayments: LoanRepayment[]) {
  return repayments.reduce((sum, r) => sum + r.amount, 0);
}

export function getNextPayment(repayments: LoanRepayment[]): LoanRepayment | undefined {
  return repayments
    .filter((r) => r.status !== ERepaymentStatus.PAID)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
}
