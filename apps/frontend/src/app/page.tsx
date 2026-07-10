import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">MIJOE</h1>
          <p className="text-xl text-gray-600">Microfinance Platform powered by SevisPass</p>
          <p className="text-sm text-gray-500 mt-2">Secure • Transparent • Inclusive</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/borrower/login">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Borrower Portal</CardTitle>
                <CardDescription>
                  Access your loans, apply for new ones, and track repayments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ SevisPass digital identity login</p>
                  <p>✓ Apply for loans in English or Tok Pisin</p>
                  <p>✓ Real-time application status</p>
                  <p>✓ Track your repayment schedule</p>
                  <p>✓ Build your credit history</p>
                </div>
                <Button className="mt-4 w-full">Enter Borrower Portal</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/staff/dashboard">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Staff Portal</CardTitle>
                <CardDescription>
                  Manage applications, borrowers, and track repayments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Dashboard with real-time metrics</p>
                  <p>✓ Review loan applications</p>
                  <p>✓ Full borrower management</p>
                  <p>✓ Repayment tracking</p>
                  <p>✓ Reports and analytics</p>
                </div>
                <Button className="mt-4 w-full" variant="outline">Enter Staff Portal</Button>
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
