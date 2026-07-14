import { Router, Request, Response } from 'express';
import axios from 'axios';
import { OIDC4VP_SERVER_URL, CLIENT_ID, CLIENT_SECRET, WEB_ORIGIN } from '../config.js';

const router: Router = Router();

function ssoHeaders() {
    return {
        'Content-Type': 'application/json',
        Origin: WEB_ORIGIN,
        'X-Client-ID': CLIENT_ID,
        'X-Client-Secret': CLIENT_SECRET,
    };
}

// Proxies to the SSO server so the browser never sees CLIENT_SECRET.
router.get('/session-status', async (req: Request, res: Response) => {
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
});

router.get('/user', async (req: Request, res: Response) => {
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
});

export default router;
