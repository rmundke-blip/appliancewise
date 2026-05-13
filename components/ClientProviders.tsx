'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, GitCompare } from 'lucide-react';

interface ToastData {
  id: string;
  count: number;
}

function CompareToast({ toast, onClose }: { toast: ToastData; onClose: (id: string) => void }) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 7000;

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  }, [toast.id, onClose]);

  useEffect(() => {
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleClose();
      }
    }, 50);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleClose]);

  const remaining = toast.count === 1 ? 2 : 1;
  const message =
    toast.count === 1
      ? `Add ${remaining} more products to compare`
      : `Add ${remaining} more product to compare`;

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(8px) scale(0.96); }
        }
      `}</style>
      <div
        style={{
          animation: exiting
            ? 'toastSlideOut 0.3s cubic-bezier(0.4,0,1,1) forwards'
            : 'toastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#30363D] bg-[#161B22] shadow-2xl shadow-black/50"
      >
        <div
          className="absolute top-0 left-0 h-[2px] bg-[#00D4AA]"
          style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}
        />
        <div className="p-4 pr-10">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#00D4AA]/15 border border-[#00D4AA]/25 flex items-center justify-center mt-0.5">
              <GitCompare size={14} className="text-[#00D4AA]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-2">
                {[1, 2, 3].map((slot) => (
                  <div
                    key={slot}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      slot <= toast.count ? 'w-5 bg-[#00D4AA]' : 'w-3 bg-[#30363D]'
                    }`}
                  />
                ))}
                <span className="text-[10px] text-[#8B949E] ml-1 font-medium">
                  {toast.count}/3 added
                </span>
              </div>
              <p className="text-[#E6EDF3] text-sm font-medium leading-snug">
                {message},{' '}
                <Link
                  href="/compare"
                  onClick={() => onClose(toast.id)}
                  className="text-[#00D4AA] underline underline-offset-2 decoration-[#00D4AA]/40 hover:decoration-[#00D4AA] transition-all font-semibold"
                >
                  or click here to compare now
                </Link>
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          aria-label="Dismiss"
          className="absolute top-3 right-3 w-6 h-6 rounded-lg flex items-center justify-center text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#30363D] transition-all"
        >
          <X size={13} />
        </button>
      </div>
    </>
  );
}

export default function ClientProviders() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const router = useRouter();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { count } = (e as CustomEvent<{ count: number }>).detail;
      if (count >= 3) {
        router.push('/compare');
        return;
      }
      setToasts([{ id: `toast-${Date.now()}`, count }]);
    };
    window.addEventListener('compare-toast', handler);
    return () => window.removeEventListener('compare-toast', handler);
  }, [router]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-3 items-end">
      {toasts.map((t) => (
        <CompareToast key={t.id} toast={t} onClose={removeToast} />
      ))}
    </div>
  );
}
