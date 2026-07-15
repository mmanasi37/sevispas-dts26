import { Borrower, BorrowerDashboard, ERepaymentStatus, LoanApplication, NewLoanApplicationInput, LoanRepayment } from "./types";
import { sleep } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const fetcher = (...args: any) => fetch(...args).then(res => res.json())

async function createApi(url: string, options?: RequestInit) {
  const opts = Object.assign({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    },
  }, options);
  const res = await fetch(`${API_URL}/api${url}`, opts);

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

export async function getBorrowers(): Promise<Borrower[]> {
  try {
    const api = await createApi(`/borrowers`);
    return api;
  } catch (error) {
    console.error("Failed to fetch borrowers:", error);
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

export async function getApplications(): Promise<LoanApplication[]> {
  try {
    const api = await createApi(`/loans`);
    return api;
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    throw error;
  }
}

export async function getLoanRepayments(loanId: number): Promise<LoanRepayment[]> {
  try {
    const api = await createApi(`/loans/${loanId}/repayments`);
    return api;
  } catch (error) {
    console.error("Failed to fetch loan repayments:", error);
    throw error;
  }
}


export const approveLoan = async (loanId: number, note?: string) => {
  const res = await createApi(`/loans/${loanId}/approve`, {
    method: "POST",
    body: JSON.stringify({
      note,
    }),
  });

  return res;
};

export const rejectLoan = async (loanId: number, rejectionReason: string) => {
  const res = await createApi(`/loans/${loanId}/reject`, {
    method: "POST",
    body: JSON.stringify({
      rejectionReason,
    }),
  });

  return res;
};

export async function getRecentLoans(): Promise<any[]> {
  try {
    // const api = await createApi(`/loans/recent`);
    // return api;
    await sleep(2000);
    return [
      { id: "APP-2024-01", borrower: "Sarah M.", amount: "K 3,000", date: "2 hours ago", status: "pending" },
      { id: "APP-2024-02", borrower: "Michael K.", amount: "K 5,000", date: "4 hours ago", status: "review" },
      { id: "APP-2024-03", borrower: "David L.", amount: "K 2,500", date: "Yesterday", status: "pending" },
    ];
  } catch (error) {
    console.error("Failed to fetch new loans:", error);
    throw error;
  }
}

export async function getNewLoans(): Promise<any> {
  try {
    // const api = await createApi(`/loans/new`);
    // return api;
    await sleep(2000);
    return {
      count: 24,
      change: "+12%",
      trend: "up",
    };
  } catch (error) {
    console.error("Failed to fetch new loans:", error);
    throw error;
  }
}

export async function getPendingLoans(): Promise<any> {
  try {
    // const api = await createApi(`/loans/pending`);
    // return api;
    await sleep(2000);
    return {
      count: 24,
      change: "+12%",
      trend: "up",
    };
  } catch (error) {
    console.error("Failed to fetch pending loans:", error);
    throw error;
  }
}

export async function getActiveLoans(): Promise<any> {
  try {
    // const api = await createApi(`/loans/active`);
    // return api;
    await sleep(2000);
    return {
      count: 24,
      change: "+12%",
      trend: "up",
    };
  } catch (error) {
    console.error("Failed to fetch active loans:", error);
    throw error;
  }
}

export async function getLoansWithOverduePayments(): Promise<any> {
  try {
    // const api = await createApi(`/loans/overdue`);
    // return api;
    await sleep(2000);
    return {
      count: 24,
      change: "+12%",
      trend: "up",
    };
  } catch (error) {
    console.error("Failed to fetch loans with overdue payments:", error);
    throw error;
  }
}