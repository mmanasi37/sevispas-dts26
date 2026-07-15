import { AppContext } from "@/contexts/AppContext";
import { useContext } from "react";

const useLanguage = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useLanguage must be used within an AppProvider");
    }

    const { t, setLanguage, language, toggleLanguage } = context;

    return { t, setLanguage, language, toggleLanguage };
};

export default useLanguage;
