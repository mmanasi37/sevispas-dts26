import { AppContext } from "@/contexts/AppContext";
import { useContext } from "react";

const useUser = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useUser must be used within an AppProvider");
    }

    const { user, setUser } = context;

    return { user, setUser };
}

export default useUser;