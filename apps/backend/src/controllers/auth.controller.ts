import type { Request, Response } from 'express';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { db } from '../database/index.ts';
import { env } from '../env.ts';
import { generateState, generateNonce, verifyState, processVPToken, generateToken, verifyToken, handleDatabaseError } from '../libs/utils.ts';

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

export const callback = async (req: Request, res: Response) => {
    const { vp_token, state } = req.body;

    try {
        const { token } = req.body;

        const decoded = verifyToken(token);
        const user = await db.selectFrom('Staff').where('id', '=', Number(decoded.id)).selectAll().executeTakeFirst();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const newToken = generateToken(user);

        // Verify state matches stored value
        if (!verifyState(state)) {
            return res.status(400).json({ error: 'Invalid state' });
        }

        // Process the VP token and extract user information
        const userInfo = await processVPToken(vp_token);

        // Create user session
        req.session.user = userInfo;
        res.json({ token: newToken, success: true, redirect: '/dashboard' });
    } catch (error: any) {
        res.status(500).json({ error: 'Authentication failed', message: error.message });
    }
};

// Authentication endpoint
export const initiate = async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${env.OIDC4VP_SERVER_URL}/api/auth/third-party/authorize`,
            {
                callback_url: env.OIDC4VP_CALLBACK_URL,
                state: generateState(),
                nonce: generateNonce()
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Client-ID': env.OIDC4VP_CLIENT_ID,
                    'X-Client-Secret': env.OIDC4VP_CLIENT_SECRET
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: 'Authentication initiation failed' });
    }
};

