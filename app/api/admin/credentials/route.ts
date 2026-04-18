import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  verifySessionToken,
  updateAdminCredentials,
  createSessionToken,
} from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { currentPassword, newEmail, newPassword } = (await req.json()) as {
      currentPassword?: string;
      newEmail?: string;
      newPassword?: string;
    };
    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
    }
    if (!newEmail && !newPassword) {
      return NextResponse.json({ error: 'Provide a new email, new password, or both' }, { status: 400 });
    }

    const result = updateAdminCredentials({
      currentPassword,
      newEmail: newEmail || undefined,
      newPassword: newPassword || undefined,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Re-issue session so the current admin stays logged in with the new secret/email.
    const freshToken = createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: freshToken,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Update failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
