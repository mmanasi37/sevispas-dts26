'use server';

import { revalidatePath } from 'next/cache';
import { getSessionData } from './session';

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