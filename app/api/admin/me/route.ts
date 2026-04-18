import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken, getAdminEmail } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Always return the latest email from disk (in case it was changed).
  return NextResponse.json({ email: getAdminEmail() });
}
