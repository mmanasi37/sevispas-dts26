import type { Request, Response } from 'express';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { db } from '../database/index.ts';
import { env } from '../env.ts';
import { generateState, generateNonce, verifyState, processVPToken, generateToken, verifyToken, handleDatabaseError, handleError } from '../libs/utils.ts';
import { OIDC4VP_SERVER_URL, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, WEB_ORIGIN } from '../config.ts';
import { number } from 'zod';
import * as borrowerRepo from '../repositories/BorrowerRepository.ts';

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


        const sevisPassUser: {
            title: string;
            nationality: string;
            firstName: string;
            lastName: string;
            phone: string;
            email: string;
            gender: string;
            dob: string;
            maritalStatus: string;
            photo: string;
            address: string;
            province: string;
            district: string;
            documentNumber: string;
            issueDate: string;
            expiryDate: string;
            tier: number;
        } = {
            title: 'Mr',
            nationality: 'Nigerian',
            firstName: 'John',
            lastName: 'Doe',
            phone: '08000000000',
            email: 'name@example.com',
            gender: 'Male',
            dob: '2000-01-01',
            maritalStatus: 'Single',
            photo: 'base64',
            address: '123 Main St',
            province: 'Lagos',
            district: 'Ikeja',
            documentNumber: '123456789',
            issueDate: '2022-01-01',
            expiryDate: '2025-01-01',
            tier: 1
        };


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

        const { qrCode, sessionId, authUrl, nonce, state } = response.data;
        res.json({ qrCode, sessionId, authUrl });
    } catch (error) {
        const err = handleError(error);
        console.log(err);

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

        // {"sessionId":"duhY8g0h1JoTQdylkwZyZ56_UzZuLkyt","authenticated":false,"hasRedirect":false,"redirect":null}
        // {"sessionId":"duhY8g0h1JoTQdylkwZyZ56_UzZuLkyt","authenticated":true,"hasRedirect":true,"redirect":"/user?session=duhY8g0h1JoTQdylkwZyZ56_UzZuLkyt"}
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

        // {"user":{"sub":"urn:uuid:7bf46411-2e33-4868-919b-d12b3e06f3a5","name":"Christian","email":"chrisaugu61@gmail.com","ageOver18":true,"validUntil":"2027-07-15T21:12:45.000Z","holder":"did:nfid:2161383915911882","credentials":[{"type":["PID"],"issuer":"did:nfid:1941389815611810","issuanceDate":"2026-07-15T21:12:45.000Z","validUntil":"2027-07-15T21:12:45.000Z","subject":{"id":"urn:uuid:7bf46411-2e33-4868-919b-d12b3e06f3a5","firstName":"Christian","email":"chrisaugu61@gmail.com","ageOver18":true,"credentialSubject":"did:nfid:2161383915911882","credentialStatus":[{"type":"BitstringStatusListEntry","statusPurpose":"revocation","statusListIndex":497,"statusListCredential":"http://system-service:80/v1/status-list/revocation/6"},{"type":"BitstringStatusListEntry","statusPurpose":"suspension","statusListIndex":498,"statusListCredential":"http://system-service:80/v1/status-list/suspension/7","statusReference":"http://system-service:80/suspension-information/6107027c-5309-4649-9d23-d870ba578559"}],"_sd_alg":"sha-256"}}]},"sessionId":"duhY8g0h1JoTQdylkwZyZ56_UzZuLkyt","fieldClaims":["firstName","email","ageOver18"]}

        // Provision a Borrower row for this SevisPass identity on first login,
        // so the frontend's dashboard/status/repayment/profile lookups succeed.
        const sevisUser = response.data?.user;
        if (sevisUser?.sub) {
            try {
                await borrowerRepo.findOrCreateBySevisPass(sevisUser);
            } catch (err) {
                console.error('Failed to provision borrower for SevisPass user:', err);
            }
        }

        res.json(response.data);
    } catch {
        res.status(502).json({ error: 'Failed to fetch verified user' });
    }
}; 