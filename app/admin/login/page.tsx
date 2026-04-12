'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
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
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out. Check your connection.')), 10000)
      );

      const authCall = supabase.auth.signInWithPassword({ email, password });
      const { data, error: authError } = await Promise.race([authCall, timeout]) as Awaited<typeof authCall>;

      if (authError) {
        setError(authError.message || 'Invalid email or password.');
        return;
      }

      if (data?.session) {
        window.location.href = '/admin/dashboard';
      } else {
        setError('Login failed — check your credentials or confirm your email in Supabase.');
      }
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
          <div className="w-10 h-10 bg-[#C9A84C] rounded-sm flex items-center justify-center">
            <Building2 size={20} className="text-black" />
          </div>
          <div>
            <p className="text-white font-display font-bold">LuxEstate</p>
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
                placeholder="admin@luxestate.ae"
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
