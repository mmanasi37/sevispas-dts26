// import { getIronSessionData } from "@/server/actions";

export default async function Page({ children }: { children: React.ReactNode }) {
    // const session = await getIronSessionData();

    // return <div>{session.username} </div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                hello
                {children}
            </div>
        </div>
    )
}