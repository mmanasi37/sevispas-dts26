import crypto from 'node:crypto';

const STATE_TTL_MS = 10 * 60 * 1000;

function getStateSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return secret;
}

function sign(payload: string) {
    return crypto.createHmac('sha256', getStateSecret()).update(payload).digest('base64url');
}

export function generateState() {
    const payload = Buffer.from(
        JSON.stringify({ nonce: crypto.randomUUID(), ts: Date.now() })
    ).toString('base64url');
    return `${payload}.${sign(payload)}`;
}

export function generateNonce() {
    return crypto.randomUUID();
}

// State is a self-contained HMAC-signed token (not a server-side session lookup),
// so verification works across the stateless/serverless backend deploy.
export function verifyState(receivedState: unknown) {
    if (typeof receivedState !== 'string') return false;

    const [payload, signature] = receivedState.split('.');
    if (!payload || !signature) return false;

    const expected = sign(payload);
    const signatureBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);
    if (signatureBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(signatureBuf, expectedBuf)) {
        return false;
    }

    try {
        const { ts } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        return typeof ts === 'number' && Date.now() - ts < STATE_TTL_MS;
    } catch {
        return false;
    }
}

// Decodes the VP token's claims without verifying its signature — the staging
// SSO API doesn't document a JWKS endpoint to verify against yet. Prefer
// GET /api/user (see routes/auth.ts) for verified identity where possible.
export async function processVPToken(vpToken: unknown) {
    if (typeof vpToken !== 'string') return null;

    const parts = vpToken.split('.');
    if (parts.length !== 3) return null;

    try {
        return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    } catch {
        return null;
    }
}
