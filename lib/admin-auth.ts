// SERVER ONLY — admin credentials + session helpers. Do not import from client.
import crypto from 'crypto';

const DEFAULT_EMAIL = process.env.ADMIN_EMAIL || 'info@bnhmasterkey.ae';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || '12Master@34';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const SESSION_COOKIE = 'admin_session';

function verifyPassword(password: string, expected: string): boolean {
  return password === expected;
}

export function verifyCredentials(email: string, password: string): boolean {
  if (email.trim().toLowerCase() !== DEFAULT_EMAIL.trim().toLowerCase()) return false;
  return verifyPassword(password, DEFAULT_PASSWORD);
}

export function getAdminEmail(): string {
  return DEFAULT_EMAIL;
}

export function updateAdminCredentials(_opts: {
  currentPassword: string;
  newEmail?: string;
  newPassword?: string;
}): { ok: boolean; error?: string } {
  // Credential updates are not supported in serverless mode.
  // Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables to change credentials.
  return { ok: false, error: 'Credential updates are not supported. Update ADMIN_EMAIL and ADMIN_PASSWORD environment variables instead.' };
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ email: DEFAULT_EMAIL, exp: Date.now() + SESSION_TTL_MS })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): { email: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { email?: string; exp?: number };
    if (!parsed.email || typeof parsed.exp !== 'number' || parsed.exp <= Date.now()) return null;
    return { email: parsed.email };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);
