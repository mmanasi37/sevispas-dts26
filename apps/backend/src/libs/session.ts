import type { Request } from 'express';
import type { SessionUser } from '../types.ts';

export const getSessionUser = (req: Request): SessionUser | null => {
    return req.session.user || null;
};

export const isAuthenticated = (req: Request): boolean => {
    return !!req.session.user;
};

// export const isAdmin = (req: Request): boolean => {
//     return req.session.user?.role === 'admin';
// };

// export const hasRole = (req: Request, role: SessionUser['role']): boolean => {
//     return req.session.user?.role === role;
// };

export const updateSessionUser = (
    req: Request,
    updates: Partial<SessionUser>
): void => {
    if (req.session.user) {
        req.session.user = { ...req.session.user, ...updates };
    }
};