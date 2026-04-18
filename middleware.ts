import { NextRequest, NextResponse } from 'next/server';

// Gate /admin/* behind a session cookie. Signature is re-verified on the
// server in every API route; middleware runs on Edge and only checks that a
// cookie is present, which is enough to prevent direct visits from flashing
// the dashboard UI.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let the login page and auth API routes through.
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/login')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const hasSession = !!req.cookies.get('admin_session')?.value;
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
