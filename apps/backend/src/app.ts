import './env.js';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
// import session from 'express-session';
import routes from './routes/index.js';
import { generateState, generateNonce, verifyState, processVPToken } from './libs/utils.js';

const app: Application = express();
const port = 3001;

const SSO_SERVER = "";

app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? true }));
app.use(express.json());

// app.use(session);

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Authentication endpoint
app.post('/auth/initiate', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      'https://your-sso-server.com/api/auth/third-party/authorize',
      {
        callback_url: 'https://your-website.com/auth/callback',
        state: generateState(),
        nonce: generateNonce()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': process.env.CLIENT_ID,
          'X-Client-Secret': process.env.CLIENT_SECRET
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Authentication initiation failed' });
  }
});

// Callback endpoint
app.post('/auth/callback', async (req: Request, res: Response) => {
  const { vp_token, state } = req.body;

  try {
    // Verify state matches stored value
    if (!verifyState(state)) {
      return res.status(400).json({ error: 'Invalid state' });
    }

    // Process the VP token and extract user information
    const userInfo = await processVPToken(vp_token);

    // Create user session
    // req.session.user = userInfo;

    res.json({ success: true, redirect: '/dashboard' });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default app;