'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9998] bg-[#0D0D0D] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
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
        developed by <span className="text-[#C9A84C]">attaurrahman.dev</span>
      </p>
    </div>
  );
}
