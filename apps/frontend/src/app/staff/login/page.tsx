"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, User } from "lucide-react";
import { DigitalIdentityAuth } from "@/lib/DigitalIdentityAuth";
import Logo from "@/components/Logo";

export default function StaffLogin() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"biometric" | "credential">("biometric");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const authRef = useRef<DigitalIdentityAuth | null>(null);

  useEffect(() => {
    authRef.current = new DigitalIdentityAuth();
    return () => authRef.current?.stopPolling();
  }, []);

  const handleBiometricLogin = async () => {
    setError(null);
    setQrCode(null);
    setIsLoading(true);

    try {
      const { qrCode, sessionId } = await authRef.current!.initiateAuth();
      setQrCode(qrCode);

      authRef.current!.pollForCompletion(
        sessionId,
        () => {
          setIsLoading(false);
          router.push("/staff/dashboard");
        },
        () => {
          setIsLoading(false);
          setError("Verification failed. Please try again.");
        }
      );
    } catch {
      setIsLoading(false);
      setError("Could not start identity verification. Please try again.");
    }
  };

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/staff/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="shadow-none w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="md" animate href={null} />
          </div>
          <CardTitle className="text-2xl">Staff Login</CardTitle>
          <CardDescription>
            Secure digital identity verification for staffs
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

          {loginMethod === "biometric" ? (
            <div className="space-y-4">
              {qrCode ? (
                <div className="bg-white p-4 rounded-lg text-center border border-gray-100">
                  <div
                    className="mx-auto w-full max-w-[360px] aspect-square [&_svg]:w-full [&_svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: qrCode }}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Scan this QR code with your SevisPass wallet
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Fingerprint className="h-16 w-16 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Verify your identity with SevisPass
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    This replaces physical passport/driver&apos;s license verification
                  </p>
                </div>
              )}
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <Button
                type="button"
                className="w-full"
                disabled={isLoading}
                onClick={handleBiometricLogin}
              >
                {isLoading ? (qrCode ? "Waiting for scan..." : "Starting...") : "Verify Identity"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCredentialLogin} className="space-y-4">
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
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
