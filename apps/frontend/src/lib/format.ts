import { ELoanTerm, TLoanTerm } from "./types";

export function formatMonthYear(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatMonthShort(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function formatFullDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatTerm(term: TLoanTerm) {
  return term === ELoanTerm.SHORT ? "Short Term (5 fortnights)" : "Long Term (10 fortnights)";
}
