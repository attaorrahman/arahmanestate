// Client-safe actions — use fetch() for data mutations from client components.
import type { Inquiry } from './types';

export async function submitInquiry(inquiry: Inquiry): Promise<void> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiry),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? 'Failed to submit inquiry');
  }
}
