import { NextRequest, NextResponse } from 'next/server';
import { fetchTransactions } from '@/lib/dld-api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const page = parseInt(sp.get('page') || '1');
  const limit = parseInt(sp.get('limit') || '12');
  const offset = (page - 1) * limit;

  const result = await fetchTransactions({
    offset,
    limit,
    search: sp.get('search') || undefined,
    emirate: sp.get('emirate') || undefined,
    area: sp.get('area') || undefined,
    property_type: sp.get('property_type') || undefined,
    transaction_type: sp.get('transaction_type') || undefined,
    date_from: sp.get('date_from') || undefined,
    sort: sp.get('sort') || undefined,
  });

  return NextResponse.json({
    transactions: result.transactions,
    total: result.total,
    page,
    totalPages: Math.ceil(result.total / limit),
    live: result.live,
  });
}
