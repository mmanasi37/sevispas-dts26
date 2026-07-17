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

export async function loginBorrowerWithSevispass(sevispassId: string, name?: string) {
    "use server";

    const session = await getSessionData(false);

    session.sevispassId = sevispassId;
    session.username = name ?? session.username;
    session.isLoggedIn = true;
    await session.save();
}

export async function getCurrentSevispassId(): Promise<string> {
    "use server";

    const session = await getSessionData(false);
    return session.sevispassId ?? DEMO_SEVISPASS_ID;
}