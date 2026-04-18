'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle } from 'lucide-react';
import { MEETING_SLOTS, formatSlotLabel } from '@/lib/meeting-slots';
import { useLanguage } from '@/lib/language-context';

interface FormState {
  name: string;
  email: string;
  phone: string;
  purpose: string;
  location: string;
  message: string;
  date: string;
  time: string;
}

const EMPTY: FormState = {
  name: '', email: '', phone: '', purpose: '', location: '', message: '', date: '', time: '',
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function currentTimeHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function MeetingScheduler() {
  const { t, dir } = useLanguage();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<FormState | null>(null);

  const today = todayStr();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!form.date) {
      setBookedSlots([]);
      return;
    }
    setLoadingSlots(true);
    fetch(`/api/meetings/slots?date=${encodeURIComponent(form.date)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { booked: [] }))
      .then((data: { booked: string[] }) => setBookedSlots(data.booked || []))
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [form.date]);

  useEffect(() => {
    if (form.time && bookedSlots.includes(form.time)) {
      set('time', '');
    }
  }, [bookedSlots, form.time]);

  const isSlotDisabled = (slot: string) => {
    if (bookedSlots.includes(slot)) return true;
    if (form.date === today && slot <= currentTimeHHMM()) return true;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.time) {
      setError(t('meeting.select_time'));
      return;
    }
    if (bookedSlots.includes(form.time)) {
      setError(t('meeting.unavailable'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 409) {
        setError(data.error || t('meeting.unavailable'));
        setBookedSlots((prev) => (prev.includes(form.time) ? prev : [...prev, form.time]));
        set('time', '');
        return;
      }
      if (!res.ok) {
        setError(data.error || 'Failed to schedule meeting.');
        return;
      }
      setSuccess({ ...form });
      setForm(EMPTY);
      setBookedSlots([]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C9A84C] transition-colors';
  const labelClass = 'block text-gray-600 text-xs font-medium uppercase tracking-wide mb-1.5';

  if (success) {
    const successMsg = t('meeting.success_msg').replace('{name}', success.name);
    return (
      <div className="bg-white rounded-sm border border-gray-100 p-10 text-center luxury-shadow" dir={dir}>
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={26} className="text-green-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">{t('meeting.success_title')}</h2>
        <p className="text-gray-500 text-sm mb-5">{successMsg}</p>
        <div className="bg-[#FAFAF8] border border-gray-100 rounded-sm p-4 text-left max-w-sm mx-auto space-y-1.5 text-sm">
          <p><span className="text-gray-400">{t('meeting.date').replace(' *', '')}:</span> <span className="text-gray-800">{success.date}</span></p>
          <p><span className="text-gray-400">{t('meeting.time').replace(' *', '')}:</span> <span className="text-gray-800">{formatSlotLabel(success.time)}</span></p>
          <p><span className="text-gray-400">{t('meeting.purpose').replace(' *', '')}:</span> <span className="text-gray-800">{success.purpose}</span></p>
          <p><span className="text-gray-400">{t('meeting.location').replace(' *', '')}:</span> <span className="text-gray-800">{success.location}</span></p>
        </div>
        <button
          type="button"
          onClick={() => setSuccess(null)}
          className="mt-6 text-sm text-[#C9A84C] hover:text-[#b8963f] font-medium"
        >
          {t('meeting.schedule_another')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-gray-100 p-6 sm:p-8 luxury-shadow space-y-6" dir={dir}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>{t('meeting.name')}</label>
          <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} placeholder={t('meeting.name_placeholder')} />
        </div>
        <div>
          <label className={labelClass}>{t('meeting.email')}</label>
          <input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} placeholder={t('meeting.email_placeholder')} />
        </div>
        <div>
          <label className={labelClass}>{t('meeting.phone')}</label>
          <input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} placeholder={t('meeting.phone_placeholder')} />
        </div>
        <div>
          <label className={labelClass}>{t('meeting.purpose')}</label>
          <select required value={form.purpose} onChange={(e) => set('purpose', e.target.value)} className={inputClass}>
            <option value="" disabled>{t('meeting.select_purpose')}</option>
            <option value="Property Viewing">{t('meeting.property_viewing')}</option>
            <option value="Investment Consultation">{t('meeting.investment')}</option>
            <option value="Buy Property">{t('meeting.buy')}</option>
            <option value="Rent Property">{t('meeting.rent')}</option>
            <option value="Sell Property">{t('meeting.sell')}</option>
            <option value="General Inquiry">{t('meeting.general')}</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('meeting.location')}</label>
        <input
          required
          type="text"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          className={inputClass}
          placeholder={t('meeting.location_placeholder')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {t('meeting.date')}</span>
          </label>
          <input
            required
            type="date"
            min={today}
            value={form.date}
            onChange={(e) => { set('date', e.target.value); set('time', ''); }}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {t('meeting.time')}</span>
          </label>
          <select
            required
            value={form.time}
            onChange={(e) => set('time', e.target.value)}
            disabled={!form.date || loadingSlots}
            className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}
          >
            <option value="" disabled>
              {!form.date ? t('meeting.select_date_first') : loadingSlots ? t('meeting.loading_slots') : t('meeting.select_time')}
            </option>
            {MEETING_SLOTS.map((slot) => {
              const disabled = isSlotDisabled(slot);
              return (
                <option key={slot} value={slot} disabled={disabled}>
                  {formatSlotLabel(slot)}{disabled ? ` ${t('meeting.unavailable')}` : ''}
                </option>
              );
            })}
          </select>
          {form.date && !loadingSlots && bookedSlots.length > 0 && (
            <p className="text-xs text-gray-400 mt-1.5">
              {bookedSlots.length} {bookedSlots.length === 1 ? t('meeting.slot_booked') : t('meeting.slots_booked')}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('meeting.message')}</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder={t('meeting.message_placeholder')}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-sm text-sm">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#C9A84C] hover:bg-[#b8963f] text-black font-semibold py-3 rounded-sm text-sm transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
      >
        {submitting ? (
          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        ) : t('meeting.submit')}
      </button>
    </form>
  );
}
