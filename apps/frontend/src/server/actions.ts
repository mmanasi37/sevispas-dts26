import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { UserSession } from '@/lib/types';

export async function getIronSessionData() {
    const session = await getIronSession(await cookies(), {
        password: "1LJuV9uyBb3sbWiHg3eLvmQurgAxMr",
        cookieName: "sevispass_session"
    });

    return session;
}