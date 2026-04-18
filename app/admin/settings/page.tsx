'use client';

import { useEffect, useState } from 'react';
import { Save, Eye, EyeOff, CircleCheck as CheckCircle2 } from 'lucide-react';

type Mode = 'both' | 'password';

export default function AdminSettingsPage() {
  const [mode, setMode] = useState<Mode>('both');
  const [currentEmail, setCurrentEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/me', { cache: 'no-store' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.email) { setCurrentEmail(d.email); setNewEmail(d.email); } })
      .catch(() => {});
  }, []);

  const resetFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setSuccess('');
    resetFields();
    if (m === 'password') setNewEmail(currentEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) { setError('Enter your current password'); return; }
    if (!newPassword) { setError('Enter a new password'); return; }
    if (newPassword.length < 6) { setError('New password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('New passwords do not match'); return; }
    if (mode === 'both') {
      if (!newEmail.trim()) { setError('Enter a new email'); return; }
    }

    const body: { currentPassword: string; newPassword: string; newEmail?: string } = {
      currentPassword,
      newPassword,
    };
    if (mode === 'both' && newEmail.trim().toLowerCase() !== currentEmail.trim().toLowerCase()) {
      body.newEmail = newEmail.trim();
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Update failed');
        return;
      }
      setSuccess(
        mode === 'both'
          ? 'Credentials updated. Use the new email and password next time you sign in.'
          : 'Password updated. Use the new password next time you sign in.'
      );
      if (body.newEmail) setCurrentEmail(body.newEmail);
      resetFields();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C9A84C] transition-colors';
  const labelClass = 'block text-gray-600 text-xs font-medium uppercase tracking-wide mb-1.5';

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="font-display text-gray-900 font-semibold text-lg">Account settings</h2>
        <p className="text-gray-500 text-sm mt-0.5">Signed in as <span className="text-gray-800">{currentEmail || '—'}</span></p>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-sm w-fit">
        <button
          type="button"
          onClick={() => switchMode('both')}
          className={`px-4 py-1.5 rounded-sm text-xs font-medium transition-colors ${
            mode === 'both' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Change email + password
        </button>
        <button
          type="button"
          onClick={() => switchMode('password')}
          className={`px-4 py-1.5 rounded-sm text-xs font-medium transition-colors ${
            mode === 'password' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Change password only
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className={labelClass}>Current password *</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className={`${inputClass} pr-10`}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {mode === 'both' && (
          <div>
            <label className={labelClass}>New email *</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new.email@example.com"
              className={inputClass}
              required
            />
          </div>
        )}

        <div>
          <label className={labelClass}>New password *</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={`${inputClass} pr-10`}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>Confirm new password *</label>
          <input
            type={showNew ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className={inputClass}
            autoComplete="new-password"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <div className="flex items-start gap-2 text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-sm text-sm">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963f] text-black font-semibold px-6 py-2.5 rounded-sm text-sm transition-colors disabled:opacity-60"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <><Save size={14} /> Save changes</>
          )}
        </button>
      </form>
    </div>
  );
}
