import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, UserCog, CheckCircle2, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

const borrowerFeatures = [
  "SevisPass digital identity login",
  "Apply for loans in English or Tok Pisin",
  "Real-time application status",
  "Track your repayment schedule",
  "Build your credit history",
];

const staffFeatures = [
  "Dashboard with real-time metrics",
  "Review loan applications",
  "Full borrower management",
  "Repayment tracking",
  "Reports and analytics",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-brand-green-50 via-white to-brand-gold-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <Logo size="lg" animate href={null} />
          </div>
          <p className="text-xl text-gray-600">Microfinance Platform powered by SevisPass</p>
          <p className="text-sm text-gray-500 mt-2">Secure • Transparent • Inclusive</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          <Link href="/borrower/login" className="group h-full">
            <Card
              className="h-full flex flex-col shadow-md ring-1 ring-brand-green-100 transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-green-200/60 hover:ring-brand-green-300"
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-100 text-brand-green-600 transition-transform duration-300 group-hover:scale-110">
                  <Landmark className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl mt-3">Borrower Portal</CardTitle>
                <CardDescription>
                  Access your loans, apply for new ones, and track repayments
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="space-y-2.5 text-sm text-gray-600 flex-1">
                  {borrowerFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="mt-6 w-full h-12 rounded-full text-base font-semibold shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-brand-green-300/50 group-hover:gap-3"
                >
                  Enter Borrower Portal
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/staff/login" className="group h-full">
            <Card
              className="h-full flex flex-col shadow-md ring-1 ring-brand-gold-100 transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-gold-200/60 hover:ring-brand-gold-300"
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold-100 text-brand-gold-600 transition-transform duration-300 group-hover:scale-110">
                  <UserCog className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl mt-3">Staff Portal</CardTitle>
                <CardDescription>
                  Manage applications, borrowers, and track repayments
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="space-y-2.5 text-sm text-gray-600 flex-1">
                  {staffFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-gold-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-6 w-full h-12 rounded-full text-base font-semibold border-2 border-brand-gold-200 text-brand-gold-700 shadow-sm transition-all duration-300 hover:bg-brand-gold-50 hover:border-brand-gold-300 group-hover:shadow-lg group-hover:shadow-brand-gold-200/50 group-hover:gap-3"
                >
                  Enter Staff Portal
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Powered by SevisPass - Digital Identity for Financial Inclusion</p>
        </div>
      </div>
    </div>
  );
}
