import { NextRequest, NextResponse } from 'next/server';
import {
  verifyCredentials,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string };
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (!verifyCredentials(email, password)) {
      return NextResponse.json({ error: 'Wrong credentials' }, { status: 401 });
    }
    const token = createSessionToken();
    const res = NextResponse.json({ ok: true, email });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Login failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
