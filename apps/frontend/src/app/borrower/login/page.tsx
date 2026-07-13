"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Shield, User, Lock } from "lucide-react";

export default function BorrowerLogin() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"biometric" | "credential">("biometric");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/borrower/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">SevisPass Login</CardTitle>
          <CardDescription>
            Secure digital identity verification for borrowers
          </CardDescription>
          <Badge variant="outline" className="mt-2 mx-auto">
            Verified Identity Provider
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={loginMethod === "biometric" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setLoginMethod("biometric")}
            >
              <Fingerprint className="h-4 w-4 mr-2" />
              Biometric
            </Button>
            <Button
              variant={loginMethod === "credential" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setLoginMethod("credential")}
            >
              <User className="h-4 w-4 mr-2" />
              Credential
            </Button>
          </div>

          <form onSubmit={handleLogin}>
            {loginMethod === "biometric" ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Fingerprint className="h-16 w-16 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Place your finger on the sensor or use facial recognition
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    This replaces physical passport/driver's license verification
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Identity"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email or SevisPass ID</label>
                  <Input type="text" placeholder="Enter your SevisPass ID" />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input type="password" placeholder="Enter your password" />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Sign In"}
                </Button>
              </div>
            )}
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have a SevisPass yet?
            </p>
            <Button variant="link" className="text-blue-600">
              Self-enroll for SevisPass
            </Button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              🔒 SevisPass verifies your identity without requiring physical documents.
              Your digital identity is securely stored and only shared with your consent.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
