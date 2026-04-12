import { NextResponse } from 'next/server';

// Route protection is handled client-side in app/admin/layout.tsx
// Supabase session lives in localStorage (not cookies), so middleware
// cannot reliably check it. RLS policies enforce real DB security.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
