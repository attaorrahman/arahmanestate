// Admin queries — all operations use fetch() to API routes (client-safe).
import type { Property, Emirate } from './types';

// ─── Properties ────────────────────────────────────────────────────────────

export async function getAllPropertiesAdmin(): Promise<Property[]> {
  const res = await fetch('/api/properties', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

export async function createProperty(
  payload: Omit<Property, 'id' | 'created_at'>
): Promise<Property> {
  const res = await fetch('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? 'Failed to create property');
  }
  return res.json();
}

export async function updateProperty(
  id: string,
  payload: Partial<Omit<Property, 'id' | 'created_at'>>
): Promise<Property> {
  const res = await fetch(`/api/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? 'Failed to update property');
  }
  return res.json();
}

export async function deleteProperty(id: string): Promise<void> {
  const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete property');
}

// ─── Inquiries ──────────────────────────────────────────────────────────────

export interface InquiryWithProperty {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string;
  created_at: string;
  property_id: string | null;
  properties: { title: string } | null;
}

export async function getAllInquiries(): Promise<InquiryWithProperty[]> {
  const res = await fetch('/api/inquiries', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch inquiries');
  return res.json();
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export interface DashboardStats {
  totalProperties: number;
  forSale: number;
  forRent: number;
  featured: number;
  totalInquiries: number;
  byEmirate: { slug: string; name: string; count: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch('/api/admin/stats', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

// ─── Emirates ───────────────────────────────────────────────────────────────

export async function getAllEmirates(): Promise<Emirate[]> {
  const res = await fetch('/api/emirates', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch emirates');
  return res.json();
}
