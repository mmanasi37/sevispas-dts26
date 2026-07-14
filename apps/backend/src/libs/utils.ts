import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { env } from '../env.ts';

export function generateState() {
    return crypto.randomUUID();
}

export function generateNonce() {
    return crypto.randomUUID();
}

export function verifyState(receivedState: any) {
    // Implement state verification logic
    return true; // Simplified for example
}

export async function processVPToken(vpToken: any) {
    // Implement VP token processing
    // This should verify the JWT signature and extract claims
    return {
        sub: 'user-id',
        name: 'User Name',
        email: 'user@example.com'
    };
}

export const generateToken = (user: any) => {
    return jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET);
};

export const handleDatabaseError = (error: any) => {
    if (error.code === "SQLITE_CONSTRAINT") {
        if (error.message.includes("UNIQUE constraint failed")) {
            return {
                status: 409,
                message: "A record with this value already exists."
            };
        }

        return {
            status: 400,
            message: "Database constraint violation."
        };
    }

    return {
        status: 500,
        message: "Internal server error."
    };
};