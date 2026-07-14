export const OIDC4VP_SERVER_URL = (process.env.OIDC4VP_SERVER_URL ?? '').replace(/\/+$/, '');
export const CLIENT_ID = process.env.CLIENT_ID ?? '';
export const CLIENT_SECRET = process.env.CLIENT_SECRET ?? '';
export const CALLBACK_URL = process.env.CALLBACK_URL ?? '';
export const WEB_ORIGIN = process.env.WEB_ORIGIN ?? process.env.ALLOWED_ORIGINS?.split(',')[0] ?? '';
