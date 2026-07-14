import './env.js';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import routes from './routes/index.js';
import authRoutes from './routes/auth.js';
import { generateState, generateNonce, verifyState, processVPToken } from './libs/utils.js';
import { OIDC4VP_SERVER_URL, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, WEB_ORIGIN } from './config.js';

const app: Application = express();
const port = 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? true }));
app.use(express.json());

app.use('/api', routes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Kicks off the SevisPass OIDC4VP flow: gets a QR code + sessionId back for the
// frontend to display and poll (see /api/auth/session-status, /api/auth/user).
app.post('/auth/initiate', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      `${OIDC4VP_SERVER_URL}/api/auth/third-party/authorize`,
      {
        callback_url: CALLBACK_URL,
        state: generateState(),
        nonce: generateNonce()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Origin: WEB_ORIGIN,
          'X-Client-ID': CLIENT_ID,
          'X-Client-Secret': CLIENT_SECRET
        }
      }
    );

    const { qrCode, sessionId } = response.data;
    res.json({ qrCode, sessionId });
  } catch (error) {
    res.status(500).json({ error: 'Authentication initiation failed' });
  }
});

// Called server-to-server by the SSO server once the wallet presents its
// credential — not something a browser navigates to directly.
app.post('/auth/callback', async (req: Request, res: Response) => {
  const { vp_token, state } = req.body ?? {};

  try {
    if (!verifyState(state)) {
      return res.status(400).json({ error: 'Invalid state' });
    }

    await processVPToken(vp_token);

    res.json({ success: true, redirect: '/dashboard' });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default app;
