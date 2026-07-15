'use server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { UserSession } from '@/lib/types';

const sessionOptions = {
    password: "1LJuV9uyBb3sbWiHg3eLvmQurgAxMr",
    cookieName: "sevispass_session"
};

export async function getIronSessionData() {
    const session = await getIronSession<UserSession>(await cookies(), sessionOptions);

    return session;
}

export async function setSessionData(data: UserSession) {
    const session = await getIronSession<UserSession>(await cookies(), sessionOptions);

    session.username = data.username;
    session.password = data.password;
    session.cookieName = data.cookieName;
    await session.save();
}

export async function clearSessionData() {
    const session = await getIronSession<UserSession>(await cookies(), sessionOptions);

    session.destroy();
}