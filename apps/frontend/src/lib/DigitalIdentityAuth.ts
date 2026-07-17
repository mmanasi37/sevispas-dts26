const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type InitiateAuthResponse = {
  qrCode: string;
  sessionId: string;
  // Same OIDC4VP authorization URL the QR code encodes. On a phone that
  // already holds the SevisPass wallet, opening it directly (instead of
  // scanning a code shown on that same screen) lets a single-device
  // borrower complete the exact same session — no separate device needed.
  authUrl?: string;
};

type SessionStatus = {
  sessionId: string;
  authenticated: boolean;
  hasRedirect: boolean;
  redirect: string | null;
};

export type VerifiedUser = {
  sub: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

export class DigitalIdentityAuth {
  private pollHandle: ReturnType<typeof setInterval> | null = null;

  async initiateAuth(): Promise<InitiateAuthResponse> {
    const response = await fetch(`${API_URL}/auth/initiate`, { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to initiate auth");
    }
    return response.json();
  }

  pollForCompletion(
    sessionId: string,
    onAuthenticated: (user: VerifiedUser) => void,
    onError: (error: unknown) => void
  ) {
    this.stopPolling();

    this.pollHandle = setInterval(async () => {
      try {
        const statusRes = await fetch(`${API_URL}/auth/session-status?session=${sessionId}`);
        if (!statusRes.ok) {
          throw new Error(`Session status check failed (${statusRes.status})`);
        }

        const status: SessionStatus = await statusRes.json();
        if (!status.authenticated) return;

        this.stopPolling();

        const userRes = await fetch(`${API_URL}/auth/user?session=${sessionId}`);
        if (!userRes.ok) {
          throw new Error(`Fetching verified user failed (${userRes.status})`);
        }

        const data = await userRes.json();
        onAuthenticated(data.user);
      } catch (error) {
        this.stopPolling();
        onError(error);
      }
    }, 2000);
  }

  stopPolling() {
    if (this.pollHandle) {
      clearInterval(this.pollHandle);
      this.pollHandle = null;
    }
  }
}
