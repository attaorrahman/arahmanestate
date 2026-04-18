'use client';

import { useEffect, useState } from 'react';
import { CalendarClock, Trash2, Mail, Phone, MapPin, Target } from 'lucide-react';
import { formatSlotLabel } from '@/lib/meeting-slots';
import type { Meeting } from '@/lib/types';

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/meetings', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load meetings');
      setMeetings(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this meeting?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/meetings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const now = new Date();
  const upcoming = meetings.filter((m) => new Date(`${m.date}T${m.time}`) >= now);
  const past = meetings.filter((m) => new Date(`${m.date}T${m.time}`) < now);

  const formatDate = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    });

  const Row = ({ m }: { m: Meeting }) => (
    <div className="bg-white rounded-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-gray-900 font-semibold text-sm">{m.name}</p>
            <span className="text-xs bg-[#C9A84C]/10 text-[#C9A84C] px-2 py-0.5 rounded-sm">
              {formatDate(m.date)} · {formatSlotLabel(m.time)}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
            <span className="inline-flex items-center gap-1.5">
              <Mail size={12} className="text-gray-400" />
              <a href={`mailto:${m.email}`} className="hover:text-[#C9A84C]">{m.email}</a>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone size={12} className="text-gray-400" />
              <a href={`tel:${m.phone}`} className="hover:text-[#C9A84C]">{m.phone}</a>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Target size={12} className="text-gray-400" />
              {m.purpose}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={12} className="text-gray-400" />
              {m.location}
            </span>
          </div>
          {m.message && (
            <div className="bg-gray-50 rounded-sm border border-gray-100 px-3 py-2 text-xs text-gray-700 max-w-xl whitespace-pre-wrap">
              {m.message}
            </div>
          )}
          <p className="text-gray-300 text-[11px] mt-2">
            Submitted {new Date(m.created_at).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => handleDelete(m.id)}
          disabled={deleting === m.id}
          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
          aria-label="Delete meeting"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">
          {meetings.length} total · {upcoming.length} upcoming · {past.length} past
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {loading ? (
        <div className="p-8 text-center text-gray-400 text-sm bg-white rounded-sm border border-gray-100">
          Loading meetings...
        </div>
      ) : meetings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-sm border border-gray-100">
          <CalendarClock size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No meetings scheduled yet.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-display text-gray-700 font-semibold text-xs uppercase tracking-wider">
                Upcoming
              </h3>
              {upcoming.map((m) => <Row key={m.id} m={m} />)}
            </section>
          )}
          {past.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-display text-gray-400 font-semibold text-xs uppercase tracking-wider">
                Past
              </h3>
              {past.map((m) => <Row key={m.id} m={m} />)}
            </section>
          )}
        </>
      )}
    </div>
  );
}
