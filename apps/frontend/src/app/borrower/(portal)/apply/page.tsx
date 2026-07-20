"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, Shield, AlertCircle, Upload, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KinaIcon } from "@/components/ui/kina-icon";
import { createLoanApplication, getBorrowerDashboard, getLoanTypes } from "@/lib/api";
import useLanguage from "@/hooks/use-language";
import { ELoanTerm, EEmploymentStatus, TLoanTerm, TEmploymentStatus, Borrower, LoanProduct, TDisbursementMethod } from "@/lib/types";
import { getCurrentSevispassId, getCurrentTier, upgradeTier } from "@/server/actions";
import { formatFullDate } from "@/lib/format";
import { initials, toPhotoSrc, capitalize } from "@/lib/utils";

const TOTAL_STEPS = 8;

export default function LoanApplication() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const [sevispassId, setSevispassId] = useState<string | null>(null);
  const [tier, setTier] = useState(2);
  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [loanProduct, setLoanProduct] = useState<LoanProduct | null>(null);

  // step 0 = tier gate (only shown when tier is 1), steps 1-7 = flowchart steps 2-8
  const [step, setStep] = useState(0);

  const [village, setVillage] = useState("");
  const [province, setProvince] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState<TEmploymentStatus>(null);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [hasExistingLoans, setHasExistingLoans] = useState(false);
  const [existingLender, setExistingLender] = useState("");
  const [existingLoanAmount, setExistingLoanAmount] = useState("");
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState<TLoanTerm>(ELoanTerm.SHORT);
  const [fortnights, setFortnights] = useState(5);
  const [purpose, setPurpose] = useState("");
  const [disbursementMethod, setDisbursementMethod] = useState<TDisbursementMethod>("bank_transfer");
  const [disbursementDetails, setDisbursementDetails] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const id = await getCurrentSevispassId();
        const [currentTier, dashboard, loanTypes] = await Promise.all([
          getCurrentTier(),
          getBorrowerDashboard(id),
          getLoanTypes(),
        ]);
        setSevispassId(id);
        setTier(currentTier);
        setBorrower(dashboard.borrower);
        setLoanProduct(loanTypes[0] ?? null);
        setStep(currentTier >= 2 ? 1 : 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load application");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const minFortnights = term === ELoanTerm.SHORT ? 1 : 6;
  const maxFortnights = term === ELoanTerm.SHORT ? 5 : Math.min(10, loanProduct?.max_term ?? 10);

  useEffect(() => {
    setFortnights((current) => Math.min(Math.max(current, minFortnights), maxFortnights));
  }, [term, minFortnights, maxFortnights]);

  const rate = loanProduct?.interest_rate ?? 15;
  const amountNum = Number(amount) || 0;
  const totalRepayable = amountNum * (1 + rate / 100);
  const installment = fortnights > 0 ? totalRepayable / fortnights : 0;

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    await upgradeTier();
    setTier(2);
    setIsUpgrading(false);
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!sevispassId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await createLoanApplication(sevispassId, {
        amount: amountNum,
        term,
        purpose,
        village,
        province,
        phoneNumber,
        employmentStatus,
        monthlyIncome: monthlyIncome ? Number(monthlyIncome) : null,
        existingLoans: hasExistingLoans
          ? [{ lender: existingLender, amount: Number(existingLoanAmount) || 0 }]
          : [],
        disbursementMethod,
        disbursementDetails: disbursementDetails || null,
        declarationLanguage: language,
      });
      router.push("/borrower/status");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4 max-w-2xl mx-auto text-sm text-gray-500">Loading application...</div>;
  }

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.subtitle}</CardDescription>
              </div>
              {step > 0 && (
                <Badge className="bg-green-100 text-green-700">
                  <UserCheck className="h-3 w-3 mr-1" />
                  {t.verified}
                </Badge>
              )}
            </div>
            {step > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {t.step} {step} {t.of} {TOTAL_STEPS}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {step === 0 && (
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="font-medium text-yellow-800">{t.tier1Title}</p>
                  <p className="text-sm text-yellow-700 mt-1">{t.tier1Message}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-upload">{t.uploadDocument}</Label>
                  <div className="flex items-center gap-2 border border-dashed rounded-lg p-4 text-gray-500">
                    <Upload className="h-5 w-5" />
                    <input id="doc-upload" type="file" className="text-sm" />
                  </div>
                </div>
                <Button className="w-full" onClick={handleUpgrade} disabled={isUpgrading}>
                  {isUpgrading ? t.upgrading : t.upgradeButton}
                </Button>
              </div>
            )}

            {step === 1 && borrower && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-medium">{t.identityConfirmedTitle}</p>
                </div>
                <p className="text-sm text-gray-600">{t.identityConfirmedSubtitle}</p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-center pb-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={toPhotoSrc(borrower.photo)} alt={`${borrower.first_name} ${borrower.last_name}`} />
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">{initials(borrower.first_name, borrower.last_name)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.fullName}</span>
                    <span className="font-medium">{borrower.first_name} {borrower.last_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.lastName}</span>
                    <span className="font-medium">{borrower.last_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.idTitle}</span>
                    <span className="font-medium">{borrower.title ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.gender}</span>
                    <span className="font-medium">{borrower.gender ? capitalize(borrower.gender) : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.dateOfBirth}</span>
                    <span className="font-medium">{formatFullDate(borrower.date_of_birth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.nationality}</span>
                    <span className="font-medium">{borrower.nationality ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.maritalStatus}</span>
                    <span className="font-medium">{borrower.marital_status ? capitalize(borrower.marital_status) : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.phoneNumber}</span>
                    <span className="font-medium">{borrower.phone_number ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.email}</span>
                    <span className="font-medium">{borrower.email ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.province}</span>
                    <span className="font-medium">{borrower.province ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.district}</span>
                    <span className="font-medium">{borrower.district ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.issueDate}</span>
                    <span className="font-medium">{borrower.issue_date ? formatFullDate(borrower.issue_date) : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.expiryDate}</span>
                    <span className="font-medium">{borrower.expiry_date ? formatFullDate(borrower.expiry_date) : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.sevispassId}</span>
                    <span className="font-medium">{borrower.sevispass_id}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => setStep(2)}>{t.continueBtn}</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{t.yourDetailsTitle}</p>
                  <p className="text-sm text-gray-600">{t.yourDetailsSubtitle}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village">{t.village}</Label>
                  <Input id="village" value={village} onChange={(e) => setVillage(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">{t.province}</Label>
                  <Input id="province" value={province} onChange={(e) => setProvince(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phoneNumber}</Label>
                  <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>{t.back}</Button>
                  <Button className="flex-1" disabled={!village || !province || !phoneNumber} onClick={() => setStep(3)}>{t.continueBtn}</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{t.incomeTitle}</p>
                  <p className="text-sm text-gray-600">{t.incomeSubtitle}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employment">{t.employmentType}</Label>
                  <Select value={employmentStatus ?? undefined} onValueChange={(v) => setEmploymentStatus(v as TEmploymentStatus)} required>
                    <SelectTrigger id="employment">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EEmploymentStatus.EMPLOYED}>{t.employed}</SelectItem>
                      <SelectItem value={EEmploymentStatus.SELF_EMPLOYED}>{t.selfEmployed}</SelectItem>
                      <SelectItem value={EEmploymentStatus.UNEMPLOYED}>{t.unemployed}</SelectItem>
                      <SelectItem value={EEmploymentStatus.RETIRED}>{t.retired}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">{t.monthlyIncome}</Label>
                  <div className="relative">
                    <KinaIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input id="income" type="number" className="pl-10" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>{t.back}</Button>
                  <Button className="flex-1" disabled={!employmentStatus} onClick={() => setStep(4)}>{t.continueBtn}</Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <p className="font-medium">{t.existingLoansTitle}</p>
                <div className="space-y-2">
                  <Label>{t.existingLoansQuestion}</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant={!hasExistingLoans ? "default" : "outline"} className="flex-1" onClick={() => setHasExistingLoans(false)}>
                      {t.no}
                    </Button>
                    <Button type="button" variant={hasExistingLoans ? "default" : "outline"} className="flex-1" onClick={() => setHasExistingLoans(true)}>
                      {t.yes}
                    </Button>
                  </div>
                </div>
                {hasExistingLoans && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="lender">{t.lender}</Label>
                      <Input id="lender" value={existingLender} onChange={(e) => setExistingLender(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="existing-amount">{t.existingLoanAmount}</Label>
                      <Input id="existing-amount" type="number" value={existingLoanAmount} onChange={(e) => setExistingLoanAmount(e.target.value)} />
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>{t.back}</Button>
                  <Button className="flex-1" onClick={() => setStep(5)}>{t.continueBtn}</Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <p className="font-medium">{t.loanRequestTitle}</p>
                <div className="space-y-2">
                  <Label htmlFor="amount">{t.amount}</Label>
                  <div className="relative">
                    <KinaIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="amount"
                      type="number"
                      className="pl-10"
                      value={amount}
                      min={loanProduct?.min_amount}
                      max={loanProduct?.max_amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  {loanProduct && (
                    <p className="text-xs text-gray-500">K {loanProduct.min_amount.toLocaleString()} - K {loanProduct.max_amount.toLocaleString()}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term">{t.term}</Label>
                  <Select value={term} onValueChange={(v) => setTerm(v as TLoanTerm)} required>
                    <SelectTrigger id="term">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ELoanTerm.SHORT}>{t.shortTerm}</SelectItem>
                      <SelectItem value={ELoanTerm.LONG}>{t.longTerm}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fortnights">{t.fortnights}</Label>
                  <Input
                    id="fortnights"
                    type="number"
                    min={minFortnights}
                    max={maxFortnights}
                    value={fortnights}
                    onChange={(e) => setFortnights(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">{t.purpose}</Label>
                  <Select value={purpose} onValueChange={(v) => setPurpose(v as string)} required>
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
                {amountNum > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-1">
                    <p className="text-sm font-medium text-blue-800">{t.calculatorTitle}</p>
                    <div className="flex justify-between text-sm text-blue-700">
                      <span>{t.totalRepayable}</span>
                      <span>K {totalRepayable.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-700">
                      <span>{t.installmentPerFortnight}</span>
                      <span>K {installment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(4)}>{t.back}</Button>
                  <Button className="flex-1" disabled={!amount || !purpose} onClick={() => setStep(6)}>{t.continueBtn}</Button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{t.disbursementTitle}</p>
                  <p className="text-sm text-gray-600">{t.disbursementSubtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant={disbursementMethod === "bank_transfer" ? "default" : "outline"} className="flex-1" onClick={() => setDisbursementMethod("bank_transfer")}>
                    {t.bankTransfer}
                  </Button>
                  <Button type="button" variant={disbursementMethod === "cash_pickup" ? "default" : "outline"} className="flex-1" onClick={() => setDisbursementMethod("cash_pickup")}>
                    {t.cashPickup}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disbursement-details">
                    {disbursementMethod === "bank_transfer" ? t.accountDetails : t.pickupBranch}
                  </Label>
                  <Input id="disbursement-details" value={disbursementDetails} onChange={(e) => setDisbursementDetails(e.target.value)} required />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(5)}>{t.back}</Button>
                  <Button className="flex-1" disabled={!disbursementDetails} onClick={() => setStep(7)}>{t.continueBtn}</Button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4">
                <p className="font-medium">{t.declarationTitle}</p>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                  {t.declarationText}
                </div>
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-1" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  {t.declarationAgree}
                </label>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-start">
                    <Shield className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {t.noDocs}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(6)}>{t.back}</Button>
                  <Button className="flex-1" disabled={!agreed || isSubmitting} onClick={handleSubmit}>
                    {isSubmitting ? "Submitting..." : t.submit}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
