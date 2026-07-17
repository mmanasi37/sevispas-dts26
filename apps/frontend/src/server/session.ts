import { sleep } from "@/lib/utils";
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
  sevispassId?: string;
}

export const defaultSession: UserSession = {
  username: "",
  isLoggedIn: false
};

export const sessionOptions: SessionOptions = {
  // password: "1LJuV9uyBb3sbWiHg3eLvmQurgAxMr",
  password: "b5a4GiIc3Mr1FFTA9jK2Cw7VIpI4QQz7",
  // password: "complex_password_at_least_32_characters_long",
  // cookieName: "iron-examples-app-router-server-component-and-action",
  cookieName: "sevispass_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

export async function setSessionData(data: UserSession) {
  const session = await getIronSession<UserSession>(await cookies(), sessionOptions);

  session.username = data.username;
  session.isLoggedIn = data.isLoggedIn;
  await session.save();
}

export async function clearSessionData() {
  const session = await getIronSession<UserSession>(await cookies(), sessionOptions);

  session.destroy();
}

export async function getSessionData(shouldSleep = true) {
  const session = await getIronSession<UserSession>(await cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.username = defaultSession.username;
  }

  if (shouldSleep) {
    // simulate looking up the user in db
    await sleep(250);
  }

  return session;
}
