/**
 * DDADS – Dubai Data Access Distribution System (DDA iPaaS) client.
 *
 * Spec sources:
 *   - ICD_GSB-SSIS-002-SDG-SSIS-DubaiAI-GatewayToken_v1.0.0  (auth)
 *   - SDG-DDADS-OpenAPI_PUBLICUSER_v2.1                      (data)
 *
 * Auth flow:
 *   1. POST JSON {grant_type, client_id, client_secret} to TOKEN_URL
 *      with header `x-DDA-SecurityApplicationIdentifier`
 *      → { access_token, token_type:"Bearer", expires_in }
 *   2. Data calls: GET {baseURL}/secure/ddads/openapi/1.0.0/<entity>/<dataset>
 *      with header `Authorization: Bearer <token>`
 *
 * Response shape: { "results": [ {row}, ... ] }
 *
 * Falls back to data/transactions.json on missing config or any error so the
 * page never breaks.
 */

import { Transaction } from './types';
import fallbackData from '@/data/transactions.json';

const TOKEN_URL = process.env.DDADS_TOKEN_URL || '';
const API_BASE = process.env.DDADS_API_BASE_URL || '';
const CLIENT_ID = process.env.DDADS_CLIENT_ID || '';
const CLIENT_SECRET = process.env.DDADS_CLIENT_SECRET || '';
const SECURITY_APP_ID = process.env.DDADS_SECURITY_APP_ID || '';

// DLD transactions dataset on the DDADS Open API.
// Override with env vars if DDADS support gives you different names.
const ENTITY = process.env.DDADS_ENTITY || 'dld';
const DATASET = process.env.DDADS_DATASET || 'dld_transactions-open-api';
const TRANSACTIONS_PATH = `/secure/ddads/openapi/1.0.0/${ENTITY}/${DATASET}`;

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

function isConfigured(): boolean {
  return (
    TOKEN_URL.length > 0 &&
    API_BASE.length > 0 &&
    CLIENT_ID.length > 0 &&
    CLIENT_SECRET.length > 0 &&
    SECURITY_APP_ID.length > 0
  );
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-DDA-SecurityApplicationIdentifier': SECURITY_APP_ID,
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`DDADS auth failed: ${res.status} ${res.statusText} ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  const ttl = typeof data.expires_in === 'number' ? data.expires_in : 3600;
  tokenExpiresAt = Date.now() + ttl * 1000 - 120_000;
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

function pickField(row: Record<string, any>, ...keys: string[]): any {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
    const lower = k.toLowerCase();
    if (row[lower] !== undefined && row[lower] !== null && row[lower] !== '') return row[lower];
  }
  return undefined;
}

function mapRecord(row: Record<string, any>, index: number): Transaction {
  const rawRooms = pickField(row, 'rooms_en', 'ROOMS_EN', 'rooms', 'no_of_rooms') ?? '';
  const bedrooms = String(rawRooms).toLowerCase() === 'studio'
    ? 'Studio'
    : parseInt(String(rawRooms)) || 0;

  const areaSqm = parseFloat(
    pickField(row, 'procedure_area', 'PROCEDURE_AREA', 'area_sqm', 'actual_area') ?? '0'
  );
  const area_sqft_direct = pickField(row, 'area_sqft', 'AREA_SQFT');
  const area_sqft = area_sqft_direct
    ? parseFloat(String(area_sqft_direct))
    : Math.round(areaSqm * 10.764);

  const price = parseFloat(
    pickField(row, 'trans_value', 'TRANS_VALUE', 'actual_worth', 'amount') ?? '0'
  ) || 0;

  const transGroup = String(
    pickField(row, 'trans_group_en', 'TRANS_GROUP_EN', 'transaction_group') ?? ''
  );
  const transaction_type: 'Sale' | 'Resale' = transGroup.toLowerCase().includes('resale')
    ? 'Resale'
    : 'Sale';

  const usageRaw = String(
    pickField(row, 'property_usage_en', 'PROPERTY_USAGE_EN', 'property_usage') ?? 'Residential'
  );
  const property_usage: 'Residential' | 'Commercial' = usageRaw.toLowerCase().includes('commercial')
    ? 'Commercial'
    : 'Residential';

  const id = pickField(row, 'transaction_id', 'TRANSACTION_ID', 'id') ?? `ddads-${index}`;

  return {
    id: String(id),
    project_name: pickField(row, 'project_en', 'PROJECT_EN', 'project_name', 'project_name_en') ?? 'N/A',
    building_name: pickField(row, 'building_name_en', 'BUILDING_NAME_EN', 'property_en', 'building_name') ?? 'N/A',
    unit_type: pickField(row, 'property_sub_type_en', 'PROPERTY_SUB_TYPE_EN', 'property_type_en', 'PROPERTY_TYPE_EN') ?? 'Apartment',
    bedrooms,
    area_sqft: area_sqft || 0,
    price,
    price_per_sqft: area_sqft > 0 ? Math.round(price / area_sqft) : 0,
    transaction_type,
    property_usage,
    location: pickField(row, 'area_en', 'AREA_EN', 'nearest_landmark_en', 'area_name') ?? 'Dubai',
    emirate: 'Dubai',
    sold_by: transaction_type === 'Resale' ? 'Individual' : 'Developer',
    date: pickField(row, 'instance_date', 'INSTANCE_DATE', 'transaction_date', 'date') ?? new Date().toISOString().slice(0, 10),
    capital_gain: 0,
  };
}

function buildQuery(params: DLDQueryParams): string {
  const sp = new URLSearchParams();

  // Pagination – DDADS uses page + pageSize
  const pageSize = params.limit ?? 12;
  const page = Math.floor((params.offset ?? 0) / pageSize) + 1;
  sp.set('pageSize', String(pageSize));
  sp.set('page', String(page));

  // Filtering – DDADS uses a single `filter` string of key=value comma-separated pairs
  const filters: string[] = [];
  if (params.area && params.area !== 'All') filters.push(`area_en=${params.area}`);
  if (params.property_type && params.property_type !== 'All') {
    filters.push(`property_type_en=${params.property_type}`);
  }
  if (params.transaction_type && params.transaction_type !== 'All') {
    filters.push(`trans_group_en=${params.transaction_type === 'Resale' ? 'Resales' : 'Sales'}`);
  }
  if (filters.length) sp.set('filter', filters.join(','));

  // Sorting – DDADS uses order_by + order_dir
  const sortMap: Record<string, { col: string; dir: 'asc' | 'desc' }> = {
    date_desc: { col: 'instance_date', dir: 'desc' },
    date_asc: { col: 'instance_date', dir: 'asc' },
    price_desc: { col: 'trans_value', dir: 'desc' },
    price_asc: { col: 'trans_value', dir: 'asc' },
  };
  if (params.sort && sortMap[params.sort]) {
    sp.set('order_by', sortMap[params.sort].col);
    sp.set('order_dir', sortMap[params.sort].dir);
  }

  return `?${sp.toString()}`;
}

async function callDDADS(url: string, token: string) {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    next: { revalidate: 300 },
  });
}

function applyMockFilters(data: Transaction[], params: DLDQueryParams): Transaction[] {
  let result = data;
  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.project_name.toLowerCase().includes(q) ||
        t.building_name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
    );
  }
  if (params.emirate && params.emirate !== 'All') {
    result = result.filter((t) => t.emirate === params.emirate);
  }
  if (params.area && params.area !== 'All') {
    result = result.filter((t) => t.location === params.area);
  }
  if (params.property_type && params.property_type !== 'All') {
    result = result.filter((t) => t.unit_type === params.property_type);
  }
  if (params.transaction_type && params.transaction_type !== 'All') {
    result = result.filter((t) => t.transaction_type === params.transaction_type);
  }
  return result;
}

export async function fetchTransactions(params: DLDQueryParams = {}): Promise<{
  transactions: Transaction[];
  total: number;
  live: boolean;
}> {
  if (!isConfigured()) {
    const filtered = applyMockFilters(fallbackData as Transaction[], params);
    const offset = params.offset || 0;
    const limit = params.limit || 12;
    return { transactions: filtered.slice(offset, offset + limit), total: filtered.length, live: false };
  }

  try {
    let token = await getToken();
    const url = `${API_BASE}${TRANSACTIONS_PATH}${buildQuery(params)}`;
    let res = await callDDADS(url, token);

    if (res.status === 401) {
      cachedToken = null;
      tokenExpiresAt = 0;
      token = await getToken();
      res = await callDDADS(url, token);
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`DDADS API ${res.status}: ${body.slice(0, 200)}`);
    }

    const json = await res.json();
    const records: any[] =
      json.results ??
      json.result?.records ??
      json.records ??
      json.data ??
      (Array.isArray(json) ? json : []);

    const transactions = records
      .map(mapRecord)
      .filter((t: Transaction) => t.price > 0);

    const total = json.total ?? json.totalCount ?? json.result?.total ?? transactions.length;
    return { transactions, total, live: true };
  } catch (err) {
    console.error('[DDADS] live fetch failed, serving mock data:', err);
    const filtered = applyMockFilters(fallbackData as Transaction[], params);
    const offset = params.offset || 0;
    const limit = params.limit || 12;
    return { transactions: filtered.slice(offset, offset + limit), total: filtered.length, live: false };
  }
}
