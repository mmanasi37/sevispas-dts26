import { getSessionData } from "@/server/session";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getSessionData();

    console.log(session)

    if (!session.isLoggedIn) {
        redirect('/staff/login');
    }

    return redirect('/staff/dashboard');
}