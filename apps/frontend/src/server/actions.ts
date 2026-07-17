'use server';

import { revalidatePath } from 'next/cache';
import { getSessionData } from './session';
import { DEMO_SEVISPASS_ID } from '@/lib/utils';

export async function logout() {
    "use server";

    const session = await getSessionData(false);
    session.destroy();
    revalidatePath("/staff/login");
}

export async function login(formData: FormData) {
    "use server";

    const session = await getSessionData();

    session.username = (formData.get("username") as string) ?? "No username";
    session.isLoggedIn = true;
    await session.save();

    revalidatePath("/staff/dashboard");
}

// SevisPass staging doesn't expose an explicit tier field — a verified user with at
// least one credential (e.g. a government-ID/"PID" type) is treated as Tier 2+;
// no credentials at all means Tier 1 and the borrower must upgrade before applying.
export async function loginBorrowerWithSevispass(sevispassId: string, name?: string, credentials?: unknown) {
    "use server";

    const session = await getSessionData(false);

    session.sevispassId = sevispassId;
    session.username = name ?? session.username;
    session.tier = Array.isArray(credentials) && credentials.length > 0 ? 2 : 1;
    session.isLoggedIn = true;
    await session.save();
}

export async function getCurrentSevispassId(): Promise<string> {
    "use server";

    const session = await getSessionData(false);
    return session.sevispassId ?? DEMO_SEVISPASS_ID;
}

// Defaults to Tier 2 when there's no real session (demo/dev path) so the demo
// borrower is never blocked by the gate.
export async function getCurrentTier(): Promise<number> {
    "use server";

    const session = await getSessionData(false);
    return session.tier ?? 2;
}

// UI-only placeholder: SevisPass staging has no real tier-upgrade endpoint to call,
// so "uploading a document" just flips the session's tier flag.
export async function upgradeTier(): Promise<void> {
    "use server";

    const session = await getSessionData(false);
    session.tier = 2;
    await session.save();
}