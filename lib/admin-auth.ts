import { cookies } from 'next/headers';

const COOKIE_NAME = 'zohra_admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const encoder = new TextEncoder();

function config() {
  const login = process.env.ADMIN_LOGIN;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  return login && password && secret ? { login, password, secret } : null;
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function authenticateAdmin(login: string, password: string) {
  const credentials = config();
  return Boolean(credentials && login === credentials.login && password === credentials.password);
}

export async function createAdminSession() {
  const credentials = config();
  if (!credentials) throw new Error('ADMIN_AUTH_NOT_CONFIGURED');
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  return `${expiresAt}.${await sign(String(expiresAt), credentials.secret)}`;
}

export async function hasAdminSession() {
  const credentials = config();
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  if (!credentials || !session) return false;
  const [expiresAt, signature] = session.split('.');
  if (!expiresAt || !signature || Number(expiresAt) < Math.floor(Date.now() / 1000)) return false;
  return signature === await sign(expiresAt, credentials.secret);
}

export function adminSessionCookie(token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION_SECONDS}${secure}`;
}

export function clearAdminSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}
