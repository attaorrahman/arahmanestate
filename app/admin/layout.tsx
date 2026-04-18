'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Building2, MessageSquare, LogOut, Menu, X, ChevronRight, Settings, CalendarClock, Bell, Handshake,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/meetings', label: 'Meetings', icon: CalendarClock },
  { href: '/admin/partners', label: 'Partners', icon: Handshake },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meetingCount, setMeetingCount] = useState(0);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    fetch('/api/admin/me', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) {
          router.replace('/admin/login');
          return;
        }
        const data = (await res.json()) as { email: string };
        setUserEmail(data.email);
      })
      .catch(() => router.replace('/admin/login'));
  }, [isLoginPage, router]);

  useEffect(() => {
    if (isLoginPage) return;
    const loadCount = () => {
      fetch('/api/meetings', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : []))
        .then((data: { date: string; time: string }[]) => {
          const now = new Date();
          const upcoming = data.filter((m) => new Date(`${m.date}T${m.time}`) >= now);
          setMeetingCount(upcoming.length);
        })
        .catch(() => {});
    };
    loadCount();
    const interval = setInterval(loadCount, 60000);
    return () => clearInterval(interval);
  }, [isLoginPage, pathname]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex h-screen bg-gray-50 font-body overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#0D0D0D] flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8">
          <img src="/BNHLogo.jpg" alt="BNH MasterKey" className="w-8 h-8 rounded-sm object-contain" />
          <div>
            <p className="text-white font-display font-bold text-sm leading-none">BNH <span className="text-[#C9A84C]">MasterKey</span></p>
            <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-500 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            const isMeetings = href === '/admin/meetings';
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                  active
                    ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
                {isMeetings && meetingCount > 0 && (
                  <span className="ml-auto min-w-[20px] h-[20px] bg-[#C9A84C] text-black text-[10px] font-bold rounded-full px-1.5 flex items-center justify-center">
                    {meetingCount > 99 ? '99+' : meetingCount}
                  </span>
                )}
                {!isMeetings && active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-white/8">
          <div className="px-3 py-2 mb-1">
            <p className="text-gray-500 text-xs">Signed in as</p>
            <p className="text-white text-xs truncate mt-0.5">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-900"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-display text-gray-900 font-semibold text-base">
              {navItems.find((n) => pathname.startsWith(n.href))?.label || 'Admin'}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/admin/meetings"
              className="relative p-2 -m-2 text-gray-500 hover:text-[#C9A84C] transition-colors"
              aria-label={`Meetings (${meetingCount} upcoming)`}
              title={meetingCount > 0 ? `${meetingCount} upcoming meeting${meetingCount === 1 ? '' : 's'}` : 'Meetings'}
            >
              <Bell size={18} />
              {meetingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-[#C9A84C] text-black text-[10px] font-bold rounded-full px-1 flex items-center justify-center">
                  {meetingCount > 99 ? '99+' : meetingCount}
                </span>
              )}
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-xs text-gray-400 hover:text-[#C9A84C] transition-colors"
            >
              View site →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
