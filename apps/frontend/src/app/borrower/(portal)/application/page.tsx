"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Globe, Shield, AlertCircle } from "lucide-react";
import { KinaIcon } from "@/components/ui/kina-icon";
import { createLoanApplication } from "@/lib/api";
import { DEMO_SEVISPASS_ID } from "@/lib/session";

export default function LoanApplication() {
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "tp">("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [purpose, setPurpose] = useState("");

  const content = {
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

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createLoanApplication(DEMO_SEVISPASS_ID, {
        amount: Number(amount),
        term,
        purpose,
      });
      router.push("/borrower/status");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end items-center mb-6">
          <div className="flex gap-2">
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
            >
              <Globe className="h-4 w-4 mr-1" />
              English
            </Button>
            <Button
              variant={language === "tp" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("tp")}
            >
              <Globe className="h-4 w-4 mr-1" />
              Tok Pisin
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.subtitle}</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <UserCheck className="h-3 w-3 mr-1" />
                {t.verified}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">{t.amount}</Label>
                <div className="relative">
                  <KinaIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="5000"
                    className="pl-10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="term">{t.term}</Label>
                <Select value={term} onValueChange={setTerm} required>
                  <SelectTrigger id="term">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">{t.shortTerm}</SelectItem>
                    <SelectItem value="long">{t.longTerm}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">{t.purpose}</Label>
                <Select value={purpose} onValueChange={setPurpose} required>
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">{t.business}</SelectItem>
                    <SelectItem value="education">{t.education}</SelectItem>
                    <SelectItem value="housing">{t.housing}</SelectItem>
                    <SelectItem value="medical">{t.medical}</SelectItem>
                    <SelectItem value="other">{t.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  {t.noDocs}
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : t.submit}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
