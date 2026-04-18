/**
 * DLD (Dubai Land Department) Real Estate Transactions API client.
 *
 * Auth flow:
 *   1. Exchange API Key + Secret for a Bearer token (valid ~30 min)
 *   2. Use the token in every data request
 *   3. Re-authenticate when the token expires
 *
 * When the API keys are not yet configured, the module falls back to
 * the local mock data in data/transactions.json so the page still works.
 */

import { Transaction } from './types';
import fallbackData from '@/data/transactions.json';

const API_BASE = process.env.DLD_API_BASE_URL || '';
const API_KEY = process.env.DLD_API_KEY || '';
const API_SECRET = process.env.DLD_API_SECRET || '';

// Token is only valid on the server (env vars are server-side)
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

function isConfigured(): boolean {
  return (
    API_BASE.length > 0 &&
    API_KEY.length > 0 &&
    API_SECRET.length > 0 &&
    API_KEY !== 'PASTE_YOUR_API_KEY_HERE'
  );
}

/**
 * Get a valid OAuth Bearer token, refreshing if expired.
 */
async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  // The token endpoint follows the Data.Dubai / Dubai Pulse pattern
  const tokenUrl =
    'https://apis.data.dubai/oauth/client_credential/accesstoken?grant_type=client_credentials';

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_id=${encodeURIComponent(API_KEY)}&client_secret=${encodeURIComponent(API_SECRET)}`,
  });

  if (!res.ok) {
    throw new Error(`DLD Auth failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  // Expire 2 min early to be safe (token is typically valid for 30 min)
  tokenExpiresAt = Date.now() + (data.expires_in ? data.expires_in * 1000 - 120_000 : 25 * 60 * 1000);

  return cachedToken!;
}

export interface DLDQueryParams {
  offset?: number;
  limit?: number;
  area?: string;
  emirate?: string;
  property_type?: string;
  transaction_type?: string;
  date_from?: string;
  date_to?: string;
  bedrooms?: string;
  sort?: string;
  search?: string;
}

/**
 * Map raw DLD API record → our Transaction type.
 * Column names may vary; this handles common DLD/Dubai-Pulse column names.
 */
function mapRecord(row: Record<string, any>, index: number): Transaction {
  return {
    id: row.TRANSACTION_ID || row.transaction_id || `dld-${index}`,
    project_name: row.PROJECT_EN || row.project_en || row.PROJECT_NAME || 'N/A',
    building_name: row.BUILDING_NAME_EN || row.building_name_en || row.PROPERTY_EN || 'N/A',
    unit_type: row.PROPERTY_TYPE_EN || row.property_type_en || 'Apartment',
    bedrooms: row.ROOMS_EN === 'Studio' || row.rooms_en === 'Studio'
      ? 'Studio'
      : parseInt(row.ROOMS_EN || row.rooms_en || '0') || 0,
    area_sqft: Math.round(
      parseFloat(row.PROCEDURE_AREA || row.procedure_area || row.AREA_SQFT || '0') * 10.764
    ) || 0, // DLD reports in sqm, convert to sqft
    price: parseFloat(row.TRANS_VALUE || row.trans_value || row.ACTUAL_WORTH || '0') || 0,
    price_per_sqft: 0, // computed below
    transaction_type: (row.TRANS_GROUP_EN || row.trans_group_en || 'Sale').includes('Resale')
      ? 'Resale'
      : 'Sale',
    property_usage: (row.PROPERTY_USAGE_EN || row.property_usage_en || 'Residential').includes('Commercial')
      ? 'Commercial'
      : 'Residential',
    location: row.AREA_EN || row.area_en || row.NEAREST_LANDMARK_EN || 'Dubai',
    emirate: 'Dubai', // DLD data is Dubai-only
    sold_by: (row.TRANS_GROUP_EN || row.trans_group_en || '').includes('Resale') ? 'Individual' : 'Developer',
    date: row.INSTANCE_DATE || row.instance_date || row.TRANSACTION_DATE || new Date().toISOString().slice(0, 10),
    capital_gain: 0, // not available from raw DLD data
  };
}

/**
 * Fetch transactions from the live DLD API.
 * Falls back to local mock data when API keys are not configured.
 */
export async function fetchTransactions(params: DLDQueryParams = {}): Promise<{
  transactions: Transaction[];
  total: number;
  live: boolean;
}> {
  // ── Fallback to mock data if API is not configured ──
  if (!isConfigured()) {
    let data = fallbackData as Transaction[];

    // Apply client-side filters to mock data
    if (params.search) {
      const q = params.search.toLowerCase();
      data = data.filter(
        (t) =>
          t.project_name.toLowerCase().includes(q) ||
          t.building_name.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }
    if (params.emirate && params.emirate !== 'All') {
      data = data.filter((t) => t.emirate === params.emirate);
    }
    if (params.area && params.area !== 'All') {
      data = data.filter((t) => t.location === params.area);
    }
    if (params.property_type && params.property_type !== 'All') {
      data = data.filter((t) => t.unit_type === params.property_type);
    }
    if (params.transaction_type && params.transaction_type !== 'All') {
      data = data.filter((t) => t.transaction_type === params.transaction_type);
    }

    const total = data.length;
    const offset = params.offset || 0;
    const limit = params.limit || 12;
    data = data.slice(offset, offset + limit);

    return { transactions: data, total, live: false };
  }

  // ── Live API call ──
  try {
    const token = await getToken();

    // Build query string for DLD API
    const queryParts: string[] = [];
    if (params.limit) queryParts.push(`limit=${params.limit}`);
    if (params.offset) queryParts.push(`offset=${params.offset}`);

    // Build filter conditions (DLD API uses SQL-like where clauses)
    const filters: string[] = [];
    if (params.area && params.area !== 'All') {
      filters.push(`AREA_EN='${params.area}'`);
    }
    if (params.property_type && params.property_type !== 'All') {
      filters.push(`PROPERTY_TYPE_EN='${params.property_type}'`);
    }
    if (params.transaction_type && params.transaction_type !== 'All') {
      const group = params.transaction_type === 'Resale' ? 'Resale' : 'Sales';
      filters.push(`TRANS_GROUP_EN like '%${group}%'`);
    }
    if (params.date_from) {
      filters.push(`INSTANCE_DATE>='${params.date_from}'`);
    }
    if (params.search) {
      filters.push(`(PROJECT_EN like '%${params.search}%' or AREA_EN like '%${params.search}%')`);
    }

    if (filters.length > 0) {
      queryParts.push(`where=${encodeURIComponent(filters.join(' and '))}`);
    }

    // Sort
    if (params.sort) {
      const sortMap: Record<string, string> = {
        date_desc: 'INSTANCE_DATE desc',
        date_asc: 'INSTANCE_DATE asc',
        price_desc: 'TRANS_VALUE desc',
        price_asc: 'TRANS_VALUE asc',
      };
      if (sortMap[params.sort]) {
        queryParts.push(`sort=${encodeURIComponent(sortMap[params.sort])}`);
      }
    }

    const url = `${API_BASE}${queryParts.length ? '?' + queryParts.join('&') : ''}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 min on server
    });

    if (!res.ok) {
      // If token expired, clear and retry once
      if (res.status === 401) {
        cachedToken = null;
        tokenExpiresAt = 0;
        const newToken = await getToken();
        const retryRes = await fetch(url, {
          headers: { Authorization: `Bearer ${newToken}`, Accept: 'application/json' },
        });
        if (!retryRes.ok) throw new Error(`DLD API retry failed: ${retryRes.status}`);
        const retryData = await retryRes.json();
        const records = retryData.result?.records || retryData.records || retryData || [];
        const transactions = records.map(mapRecord).filter((t: Transaction) => t.price > 0);
        transactions.forEach((t: Transaction) => {
          if (t.area_sqft > 0) t.price_per_sqft = Math.round(t.price / t.area_sqft);
        });
        return { transactions, total: retryData.result?.total || transactions.length, live: true };
      }
      throw new Error(`DLD API error: ${res.status}`);
    }

    const json = await res.json();
    const records = json.result?.records || json.records || json || [];
    const transactions = records.map(mapRecord).filter((t: Transaction) => t.price > 0);
    transactions.forEach((t: Transaction) => {
      if (t.area_sqft > 0) t.price_per_sqft = Math.round(t.price / t.area_sqft);
    });

    return {
      transactions,
      total: json.result?.total || json.total || transactions.length,
      live: true,
    };
  } catch (err) {
    console.error('DLD API error, falling back to mock data:', err);
    // Graceful fallback
    const data = fallbackData as Transaction[];
    return { transactions: data.slice(0, params.limit || 12), total: data.length, live: false };
  }
}
