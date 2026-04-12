'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PropertyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-[#C9A84C] text-2xl font-display font-bold">!</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
          Property unavailable
        </h2>
        <p className="font-body text-gray-500 text-sm mb-8">
          We couldn't load this property. It may have been removed or there was a network issue.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-gold px-6 py-2.5 rounded-sm font-body text-sm font-medium"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-sm font-body text-sm font-medium border border-gray-200 text-gray-700 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
