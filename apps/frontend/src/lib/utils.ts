import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

// SevisPass returns the photo claim as raw base64, not a data URI.
export function toPhotoSrc(photo: string | null | undefined): string | undefined {
  if (!photo) return undefined;
  return photo.startsWith("data:") ? photo : `data:image/jpeg;base64,${photo}`;
}

// Rough risk banding from credit_score — the only real risk signal we have.
// A brand-new borrower (score 0, no repayment history yet) reads as "high" on
// purpose: no track record is itself a real risk factor, not a fabricated one.
export function creditScoreRisk(creditScore: number): "low" | "medium" | "high" {
  if (creditScore >= 650) return "low";
  if (creditScore >= 400) return "medium";
  return "high";
}

// Fallback for when no SevisPass session exists yet (e.g. direct navigation without logging in).
export const DEMO_SEVISPASS_ID = "SP-2024-001";
