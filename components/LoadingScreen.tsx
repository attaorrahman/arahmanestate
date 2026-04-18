'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1500);
    const remove = setTimeout(() => setVisible(false), 2100);
    return () => { clearTimeout(timer); clearTimeout(remove); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#0D0D0D] flex flex-col items-center justify-center"
      style={fadeOut ? { animation: 'loading-fade-out 0.6s ease forwards' } : undefined}
    >
      <div className="flex items-center gap-1 mb-3">
        <span className="font-display text-white text-xl font-semibold tracking-wide">Loading</span>
        <span className="flex gap-[3px] ml-1">
          <span className="wave-dot text-[#C9A84C] text-xl font-bold">.</span>
          <span className="wave-dot text-[#C9A84C] text-xl font-bold">.</span>
          <span className="wave-dot text-[#C9A84C] text-xl font-bold">.</span>
        </span>
      </div>
      <p className="text-gray-500 text-xs font-body tracking-wider">
        developed by <a href="https://attaurrahman.dev" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:text-[#E8D5A3] transition-colors">attaurrahman.dev</a>
      </p>
    </div>
  );
}
