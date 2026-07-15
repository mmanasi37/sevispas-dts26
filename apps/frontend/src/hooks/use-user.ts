import { AppContext } from "@/contexts/AppContext";
import { useContext } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api";

const useUser = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useUser must be used within an AppProvider");
    }

    const { user, setUser } = context;

    return { user, setUser };
}

export default useUser;

function useUser2(id: string) {
    const { data, error, isLoading } = useSWR(`/api/user/${id}`, fetcher);

    return {
        user: data,
        isLoading,
        isError: error
    }
}