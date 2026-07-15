import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { env } from '../env.ts';

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

export const generateToken = (user: any) => {
    return jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET) as { id: string, email: string };
};

export const handleDatabaseError = (error: any) => {
    // SQLite errors
    if (error.code === "SQLITE_CONSTRAINT") {

        if (error.message.includes("UNIQUE constraint failed")) {
            return {
                status: 409,
                error: "A record with this value already exists."
            };
        }

        if (error.message.includes("FOREIGN KEY constraint failed")) {
            return {
                status: 400,
                error: "Invalid reference to related data."
            };
        }

        if (error.message.includes("NOT NULL constraint failed")) {
            return {
                status: 400,
                error: "Required field is missing."
            };
        }

        if (error.message.includes("CHECK constraint failed")) {
            return {
                status: 400,
                error: "Data validation rule failed."
            };
        }

        return {
            status: 400,
            error: "Database constraint violation."
        };
    }

    // SQLite syntax errors
    if (error.code === "SQLITE_ERROR") {
        return {
            status: 500,
            error: "Database error occurred."
        };
    }

    // SQLite busy/locked database
    if (error.code === "SQLITE_BUSY" || error.code === "SQLITE_LOCKED") {
        return {
            status: 503,
            error: "Database is temporarily unavailable."
        };
    }

    if (error.code === "SQL_PARSE_ERROR") {
        return {
            status: 400,
            error: "Invalid SQL syntax."
        };
    }

    if (error.code === "SQLITE_MISMATCH") {
        return {
            status: 400,
            error: "Data type mismatch."
        };
    }

    // return {
    //     status: 500,
    //     message: "Internal server error."
    // };

    return false;
};

export function handleError(error: any) {
    const hasDatabaseError = handleDatabaseError(error);
    if (hasDatabaseError) {
        return hasDatabaseError;
    }

    // Validation errors - Zod
    if (error.name === "ValidationError") {
        return {
            status: 422,
            error: error.message
        };
    }

    // Authentication/authorization errors
    if (error.name === "UnauthorizedError") {
        return {
            status: 401,
            error: "Unauthorized access."
        };
    }

    if (error.name === "ForbiddenError") {
        return {
            status: 403,
            error: "Access denied."
        };
    }

    // Default unknown error
    return {
        status: 500,
        error: "Internal server error."
    };
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

export async function decodeVPToken(vpToken: any) {
    // Implement VP token processing
    // This should verify the JWT signature and extract claims
    return {
        sub: 'user-id',
        name: 'User Name',
        email: 'user@example.com'
    };
}
