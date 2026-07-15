import 'express-session';
import { SessionUser } from './types.ts';
import session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        user?: SessionUser;
        token?: string;
    }
}

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: SessionUser | {
                id: number;
                roles: string[];
                permissions: string[];
            };
            session: session.Session & Partial<session.SessionData>;
        }
    }
}