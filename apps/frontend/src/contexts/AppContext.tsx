'use client';

import { User } from "@/lib/types";
import { createContext, useState } from "react";

const content: Record<"en" | "tp", Record<string, string>> = {
    en: {
        title: "Loan Application",
        subtitle: "Apply for a new loan",
        verified: "Identity Verified via SevisPass",
        amount: "Loan Amount (Kina)",
        term: "Loan Term",
        purpose: "Loan Purpose",
        shortTerm: "Short Term (up to 5 fortnights)",
        longTerm: "Long Term (up to 10 fortnights)",
        business: "Business",
        education: "Education",
        housing: "Housing",
        medical: "Medical",
        other: "Other",
        submit: "Submit Application",
        noDocs: "No additional ID documents needed - SevisPass verified your identity",
    },
    tp: {
        title: "Aplikasyon Long Dinau",
        subtitle: "Aplikim long wanpela nupela dinau",
        verified: "Identiti i verifai long SevisPass",
        amount: "Amoun long Dinau (Kina)",
        term: "Taim bilong Dinau",
        purpose: "As bilong Dinau",
        shortTerm: "Taim sot (inap long 5 wik)",
        longTerm: "Taim longpela (inap long 10 wik)",
        business: "Binis",
        education: "Skul",
        housing: "Haus",
        medical: "Marasin",
        other: "Narapela",
        submit: "Salim Aplikesen",
        noDocs: "I no gat narapela dokument i nidim - SevisPass i verifai pinis identiti bilong yu",
    },
};

export const AppContext = createContext<{
    t: Record<string, string>;
    setLanguage: (language: "en" | "tp") => void;
    language: "en" | "tp";
    toggleLanguage: () => void;
    user: User | null;
    setUser: (user: User | null) => void;
}>({
    t: content.en,
    setLanguage: () => { },
    language: "en",
    toggleLanguage: () => { },
    user: null,
    setUser: () => { },
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [language, setLanguage] = useState<"en" | "tp">("en");
    const t = content[language];

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "tp" : "en");
    };

    return (
        <AppContext.Provider value={{ t, setLanguage, language, toggleLanguage, user, setUser }}>
            {children}
        </AppContext.Provider>
    );
};
