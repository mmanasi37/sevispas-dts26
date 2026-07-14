// No real session yet (SevisPass login isn't wired up) — hardcoded to the seeded demo borrower.
export const DEMO_SEVISPASS_ID = "SP-2024-001";

export function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}
