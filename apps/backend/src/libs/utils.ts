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