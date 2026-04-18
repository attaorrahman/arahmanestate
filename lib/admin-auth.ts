// SERVER ONLY — admin credentials + session helpers. Do not import from client.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ADMIN_FILE = path.join(process.cwd(), 'data', 'admin.json');
const DEFAULT_EMAIL = 'info@bnhmasterkey.ae';
const DEFAULT_PASSWORD = '12Master@34';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const SESSION_COOKIE = 'admin_session';

interface AdminRecord {
  email: string;
  passwordHash: string;
  sessionSecret: string;
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(candidate, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function loadAdmin(): AdminRecord {
  if (!fs.existsSync(ADMIN_FILE)) {
    const rec: AdminRecord = {
      email: DEFAULT_EMAIL,
      passwordHash: hashPassword(DEFAULT_PASSWORD),
      sessionSecret: crypto.randomBytes(32).toString('hex'),
    };
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(rec, null, 2), 'utf-8');
    return rec;
  }
  return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf-8')) as AdminRecord;
}

function saveAdmin(rec: AdminRecord): void {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(rec, null, 2), 'utf-8');
}

export function verifyCredentials(email: string, password: string): boolean {
  const admin = loadAdmin();
  if (admin.email.trim().toLowerCase() !== email.trim().toLowerCase()) return false;
  return verifyPassword(password, admin.passwordHash);
}

export function getAdminEmail(): string {
  return loadAdmin().email;
}

export function updateAdminCredentials(opts: {
  currentPassword: string;
  newEmail?: string;
  newPassword?: string;
}): { ok: boolean; error?: string } {
  const admin = loadAdmin();
  if (!verifyPassword(opts.currentPassword, admin.passwordHash)) {
    return { ok: false, error: 'Current password is incorrect' };
  }
  if (opts.newEmail) {
    const trimmed = opts.newEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return { ok: false, error: 'Invalid email address' };
    }
    admin.email = trimmed;
  }
  if (opts.newPassword) {
    if (opts.newPassword.length < 6) {
      return { ok: false, error: 'New password must be at least 6 characters' };
    }
    admin.passwordHash = hashPassword(opts.newPassword);
    // Rotate session secret so all other sessions are invalidated.
    admin.sessionSecret = crypto.randomBytes(32).toString('hex');
  }
  saveAdmin(admin);
  return { ok: true };
}

export function createSessionToken(): string {
  const admin = loadAdmin();
  const payload = Buffer.from(
    JSON.stringify({ email: admin.email, exp: Date.now() + SESSION_TTL_MS })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', admin.sessionSecret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): { email: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const admin = loadAdmin();
  const expected = crypto.createHmac('sha256', admin.sessionSecret).update(payload).digest('base64url');
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
