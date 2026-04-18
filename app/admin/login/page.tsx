'use client';

import { useState } from 'react';
import { Building2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Wrong credentials');
        return;
      }

      window.location.href = '/admin/dashboard';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/BNHLogo.jpg" alt="BNH MasterKey" className="w-10 h-10 rounded-sm object-contain" />
          <div>
            <p className="text-white font-display font-bold">BNH <span className="text-[#C9A84C]">MasterKey</span></p>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </div>

        <div className="bg-white/4 border border-white/8 rounded-sm p-8">
          <h2 className="font-display text-white text-xl font-semibold mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-6">Access the admin dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@bnhmasterkey.ae"
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 pr-10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A84C] hover:bg-[#b8963f] text-black font-semibold py-3 rounded-sm text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
