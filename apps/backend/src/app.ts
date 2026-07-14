import express, { type Application, type Request, type Response } from 'express';
import { debug } from 'node:util';
import morgan from 'morgan';
// import session from 'express-session';
import routes from './routes/index.ts';
import { env } from './env.ts';
import cors from 'cors';

const app: Application = express();
const host = env.HOST;
const port = env.PORT;

const SSO_SERVER = env.OIDC4VP_SERVER_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(session({
//   secret: env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     httpOnly: true,
//     secure: env.NODE_ENV === 'production',
//     sameSite: 'lax'
//   }
// }));
app.use(morgan('combined'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/api', routes);

const server = app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    debug('HTTP server closed');
  });
});

export default app;