import 'dotenv/config';
import express, { type Application, type Request, type Response } from 'express';
import axios from 'axios';
// import session from 'express-session';
import routes from './routes/index.js';
import { generateState, generateNonce, verifyState, processVPToken } from './libs/utils.js';
import { db } from './database/index.js';
import { debug } from 'node:util';
import cors from 'cors';
import morgan from 'morgan';

const app: Application = express();
const port = 3001;

const SSO_SERVER = "";

// app.use(session);
app.use(morgan('combined'));

var corsOptions = {
  // optionsSuccessStatus: 204
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  origin: 'http://example.com',
  // origin: "*",
  // origin: function (_origin, callback) {
  //   // db.loadOrigins is an example call to load
  //   // a list of origins from a backing database
  //   db.loadOrigins(function (error, origins) {
  //     callback(error, origins);
  //   });
  // },
};
// app.use(cors(corsOptions));

app.use('/api', routes);

// app.resource = function (path: string, obj: Object) {
//   this.get(path, obj.index);
//   this.get(path + '/:a..:b{.:format}', function (req: Request, res: Response) {
//     var a = parseInt(req.params.a, 10);
//     var b = parseInt(req.params.b, 10);
//     var format = req.params.format;
//     obj.range(req, res, a, b, format);
//   });
//   this.get(path + '/:id', obj.show);
//   this.delete(path + '/:id', function (req, res) {
//     var id = parseInt(req.params.id, 10);
//     obj.destroy(req, res, id);
//   });
// };
// app.resource('/users', User);

// const apiKeys: string[] = [];

// function error(status: number, msg: string | undefined) {
//   var err = new Error(msg);
//   err.cause = status;
//   return err;
// }
// app.use('/api', function (req, res, next) {
//   var key = req.query['api-key'];

//   // key isn't present
//   if (!key) return next(error(400, 'api key required'));

//   // key is invalid
//   if (apiKeys.indexOf(key) === -1) return next(error(401, 'invalid api key'))

//   // all good, store req.key for route access
//   req.key = key;
//   next();
// });

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    debug('HTTP server closed');
  });
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