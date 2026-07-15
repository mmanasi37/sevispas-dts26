import type { Request, Response } from 'express';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { db } from '../database/index.ts';
import { env } from '../env.ts';
import { generateState, generateNonce, verifyState, processVPToken, generateToken, verifyToken, handleDatabaseError } from '../libs/utils.ts';
import { OIDC4VP_SERVER_URL, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, WEB_ORIGIN } from '../config.ts';

function ssoHeaders() {
    return {
        'Content-Type': 'application/json',
        'Origin': WEB_ORIGIN,
        'X-Client-ID': CLIENT_ID,
        'X-Client-Secret': CLIENT_SECRET,
    };
}

type UserInfo = {
    user: {
        "sub": "did:example:123",
        "name": "John Doe",
        "email": "john@example.com",
        "ageOver18": true,
        "validUntil": "2025-12-31T23:59:59Z",
        "credentials": []
    },
    sessionId: "abc123def456",
    fieldMappings: {}
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await db.selectFrom('Staff').where('email', '=', email).selectAll().executeTakeFirst();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(user);

        // Store user in session
        req.session.user = {
            sub: String(user.id),
            name: `${user.first_name} ${user.last_name}`,
            email: user.email!,
            // first_name: user.first_name,
            // last_name: user.last_name,
            // role: user.role,
            // isVerified: user.isVerified,
        };

        res.json({ token, user });
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        console.error('Login failed:', dbError);

        res.status(401).json({ error: 'Invalid credentials' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await db.selectFrom('Staff').where('email', '=', email).selectAll().executeTakeFirst();
        if (user) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.insertInto('Staff').values({
            first_name: 'Admin',
            last_name: 'User',
            email,
            password: hashedPassword,
            created_at: new Date(),
            updated_at: new Date()
        }).executeTakeFirst();
        const token = generateToken(newUser);

        res.json({ token, user: newUser });
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        console.error('Registration failed:', dbError);

        res.status(500).json({ error: 'Registration failed', message: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true });
    });
};

export const profile = async (req: Request, res: Response) => {
    try {
        const user = await db.selectFrom('Staff').where('id', '=', Number(req.session.user?.sub)).selectAll().executeTakeFirst();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error: any) {
        const dbError = handleDatabaseError(error);

        console.error('Profile failed:', dbError);

        res.status(500).json({ error: 'Profile failed', message: error.message });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        const decoded = verifyToken(token);
        const user = await db.selectFrom('Staff').where('id', '=', Number(decoded.id)).selectAll().executeTakeFirst();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newToken = generateToken(user);

        res.json({ token: newToken });
    } catch (error: any) {
        res.status(500).json({ error: 'Refresh failed' });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await db.selectFrom('Staff').where('email', '=', email).selectAll().executeTakeFirst();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const token = generateToken(user);

        res.json({ token });
    } catch (error: any) {
        res.status(500).json({ error: 'Forgot password failed', });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        const decoded = verifyToken(token);
        const user = await db.selectFrom('Staff').where('id', '=', Number(decoded.id)).selectAll().executeTakeFirst();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.updateTable('Staff').set({ password: hashedPassword }).where('id', '=', user.id).executeTakeFirst();

        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: 'Reset password failed' });
    }
};

// Called server-to-server by the SSO server once the wallet presents its
// credential — not something a browser navigates to directly.
export const callback = async (req: Request, res: Response) => {
    const { vp_token, state } = req.body ?? {};

    // try {
    //     const { token } = req.body;

    //     const decoded = verifyToken(token);
    //     const user = await db.selectFrom('Staff').where('id', '=', Number(decoded.id)).selectAll().executeTakeFirst();
    //     if (!user) {
    //         return res.status(404).json({ error: 'User not found' });
    //     }
    //     const newToken = generateToken(user);

    //     // Verify state matches stored value
    //     if (!verifyState(state)) {
    //         return res.status(400).json({ error: 'Invalid state' });
    //     }

    //     // Process the VP token and extract user information
    //     const userInfo = await processVPToken(vp_token);

    //     // Create user session
    //     req.session.user = userInfo;
    //     res.json({ token: newToken, success: true, redirect: '/dashboard' });
    // } catch (error: any) {
    //     res.status(500).json({ error: 'Authentication failed', message: error.message });
    // }

    try {
        if (!verifyState(state)) {
            return res.status(400).json({ error: 'Invalid state' });
        }

        await processVPToken(vp_token);

        res.json({
            success: true,
            sessionId: "",
            accessToken: "",
            redirect: '/dashboard'
        });
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
};

// Kicks off the SevisPass OIDC4VP flow: gets a QR code + sessionId back for the
// frontend to display and poll (see /api/auth/session-status, /api/auth/user).
// Authentication endpoint
export const initiate = async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${env.OIDC4VP_SERVER_URL}/api/auth/third-party/authorize`,
            {
                callback_url: env.CALLBACK_URL,
                state: generateState(),
                nonce: generateNonce()
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': WEB_ORIGIN,
                    'X-Client-ID': env.CLIENT_ID,
                    'X-Client-Secret': env.CLIENT_SECRET
                }
            }
        );

        const { qrCode, sessionId } = response.data;
        res.json({ qrCode, sessionId });
    } catch (error) {
        res.status(500).json({ error: 'Authentication initiation failed' });
    }
};


// Proxies to the SSO server so the browser never sees CLIENT_SECRET.
export const sessionStatus = async (req: Request, res: Response) => {
    const session = req.query.session;
    if (typeof session !== 'string') {
        return res.status(400).json({ error: 'session query param is required' });
    }

    try {
        const response = await axios.get(`${OIDC4VP_SERVER_URL}/api/session/status`, {
            params: { session },
            headers: ssoHeaders(),
        });
        res.json(response.data);
    } catch {
        res.status(502).json({ error: 'Failed to check session status' });
    }
};

export const user = async (req: Request, res: Response) => {
    const session = req.query.session;
    if (typeof session !== 'string') {
        return res.status(400).json({ error: 'session query param is required' });
    }

    try {
        const response = await axios.get(`${OIDC4VP_SERVER_URL}/api/user`, {
            params: { session },
            headers: ssoHeaders(),
        });

        res.json(response.data);

    } catch {
        res.status(502).json({ error: 'Failed to fetch verified user' });
    }
}; 