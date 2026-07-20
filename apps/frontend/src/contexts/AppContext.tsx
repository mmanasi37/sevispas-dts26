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

        step: "Step",
        of: "of",
        back: "Back",
        continueBtn: "Continue",

        tier1Title: "One More Step to Verify",
        tier1Message: "Loan applications need a Tier 2 SevisPass — a government document verified against the national registry. Upload one document to upgrade your SevisPass.",
        uploadDocument: "Upload a government document",
        upgradeButton: "Verify with SevisPass",
        upgrading: "Verifying...",

        identityConfirmedTitle: "Identity Confirmed",
        identityConfirmedSubtitle: "Your details are pre-filled from your verified SevisPass credential",
        fullName: "Full Name",
        lastName: "Last Name",
        dateOfBirth: "Date of Birth",
        sevispassId: "SevisPass ID",
        idTitle: "Title",
        nationality: "Nationality",
        gender: "Gender",
        maritalStatus: "Marital Status",
        email: "Email",
        district: "District",
        issueDate: "Issue Date",
        expiryDate: "Expiry Date",

        yourDetailsTitle: "Your Details",
        yourDetailsSubtitle: "Where can we reach you?",
        village: "Village",
        province: "Province",
        phoneNumber: "Phone Number",

        incomeTitle: "Income & Employment",
        incomeSubtitle: "Self-declared — no payslip required",
        employmentType: "Employment Type",
        employed: "Employed",
        selfEmployed: "Self-Employed",
        unemployed: "Unemployed",
        retired: "Retired",
        monthlyIncome: "Net Monthly Income (Kina, optional)",

        existingLoansTitle: "Existing Loans",
        existingLoansQuestion: "Do you have any existing loans?",
        yes: "Yes",
        no: "No",
        lender: "Lender",
        existingLoanAmount: "Outstanding Amount (Kina)",

        loanRequestTitle: "Loan Request",
        fortnights: "Number of Fortnights",
        calculatorTitle: "Repayment Estimate",
        totalRepayable: "Total Repayable",
        installmentPerFortnight: "Per Fortnight",

        disbursementTitle: "Disbursement Preference",
        disbursementSubtitle: "How would you like to receive your loan?",
        bankTransfer: "Bank Transfer",
        cashPickup: "Cash Pickup",
        accountDetails: "Account Name & Number",
        pickupBranch: "Preferred Pickup Branch",

        declarationTitle: "Declaration",
        declarationText: "I confirm that the information I have provided is true and complete to the best of my knowledge. I understand this application is submitted using my SevisPass verified digital identity, and this digital consent replaces the need for a physical signature.",
        declarationAgree: "I have read and agree to the declaration above",
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

        step: "Step",
        of: "long",
        back: "Go Bek",
        continueBtn: "Go Het",

        tier1Title: "Wanpela Step Moa Long Verifai",
        tier1Message: "Aplikesen bilong dinau i nidim Tier 2 SevisPass - wanpela gavman dokument i verifai wantaim nesenel rejista. Uploadim wanpela dokument long apgretim SevisPass bilong yu.",
        uploadDocument: "Uploadim wanpela gavman dokument",
        upgradeButton: "Verifai wantaim SevisPass",
        upgrading: "I verifai...",

        identityConfirmedTitle: "Identiti i Tru Pinis",
        identityConfirmedSubtitle: "Ol detail bilong yu i pulap pinis long verifai SevisPass kredensol",
        fullName: "Fulnem",
        lastName: "Nem Bihain",
        dateOfBirth: "De Bilong Bon",
        sevispassId: "SevisPass ID",
        idTitle: "Taitel",
        nationality: "Nesenaliti",
        gender: "Sek",
        maritalStatus: "Marit Sindaun",
        email: "Imel",
        district: "Distrik",
        issueDate: "De Bilong Isu",
        expiryDate: "De Bilong Pinis",

        yourDetailsTitle: "Ol Detail Bilong Yu",
        yourDetailsSubtitle: "Mipela inap kontaktim yu we?",
        village: "Ples",
        province: "Provins",
        phoneNumber: "Namba Fon",

        incomeTitle: "Save Moni na Wok",
        incomeSubtitle: "Yu yet i tokaut - i no nidim payslip",
        employmentType: "Kain Wok",
        employed: "I Gat Wok",
        selfEmployed: "Wok Bilong Em Yet",
        unemployed: "I No Gat Wok",
        retired: "Pinisim Wok",
        monthlyIncome: "Net Mani Long Wanpela Mun (Kina, i no nidim tumas)",

        existingLoansTitle: "Ol Dinau I Gat Pinis",
        existingLoansQuestion: "Yu gat sampela dinau pinis?",
        yes: "Yes",
        no: "Nogat",
        lender: "Lenda",
        existingLoanAmount: "Amoun I Stap Yet (Kina)",

        loanRequestTitle: "Askim Bilong Dinau",
        fortnights: "Namba Bilong Wik-tu",
        calculatorTitle: "Kalkuletim Bekim Dinau",
        totalRepayable: "Olgeta Amoun Long Bekim",
        installmentPerFortnight: "Long Wanpela Wik-tu",

        disbursementTitle: "Laik Bilong Kisim Moni",
        disbursementSubtitle: "Yu laik kisim dinau bilong yu olsem wanem?",
        bankTransfer: "Bank Transfa",
        cashPickup: "Kisim Kes",
        accountDetails: "Nem Na Namba Bilong Akaun",
        pickupBranch: "Braens Yu Laik Kisim Long En",

        declarationTitle: "Tok Tru",
        declarationText: "Mi tok tru olsem ol infomesen mi bin givim i tru na i pulap. Mi save aplikesen i go long verifai SevisPass digital identiti bilong mi, na dispela digital tok orait i senisim ol wet-sain pepa.",
        declarationAgree: "Mi ridim pinis na mi orait long dispela tok antap",
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
