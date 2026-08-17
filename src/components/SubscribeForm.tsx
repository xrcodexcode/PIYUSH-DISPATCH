'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SubscribeFormProps {
  variant?: 'inline' | 'full';
}

export function SubscribeForm({ variant = 'inline' }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const isFull = variant === 'full';
  const substackBaseUrl = 'https://xrcodex.substack.com/subscribe';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    const substackUrl = `${substackBaseUrl}?email=${encodeURIComponent(email)}`;

    try {
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: variant }),
      }).catch(() => {});

      setStatus('success');
      setMessage("Redirecting to Substack to confirm your subscription...");
      
      // Open Substack in new tab and redirect current window
      window.open(substackUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        
        
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = substackUrl;
      }, 1000);
    } catch {
      window.location.href = substackUrl;
    }
  };

  return (
    <div className={cn(
      "w-full bg-[var(--surface)] text-[var(--text-primary)] rounded-3xl border border-[var(--border-color)]",
      isFull ? "p-8 md:p-12 text-center" : "p-6 md:p-8"
    )}>
      <div className={cn(
        "max-w-2xl mx-auto",
        !isFull && "flex flex-col md:flex-row md:items-center gap-8"
      )}>
        
        <div className={cn(isFull ? "mb-8" : "flex-1")}>
          <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 font-mono text-xs font-bold border border-orange-500/20">
              Substack Integration
            </span>
          </div>
          <h2 className={cn(
            "font-serif font-bold text-[var(--text-primary)] mb-2",
            isFull ? "text-3xl md:text-4xl" : "text-2xl"
          )}>
            Get the daily dispatch.
          </h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)]">
            Join developers and founders receiving daily engineering briefings via Substack.
          </p>
        </div>

        <div className={cn("w-full", !isFull ? "md:w-80" : "max-w-md mx-auto")}>
          {status === 'success' ? (
            <div className="p-4 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-center">
              <p className="font-semibold text-[var(--accent)] text-sm mb-2">{message}</p>
              <a
                href={`${substackBaseUrl}?email=${encodeURIComponent(email)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent)] hover:underline"
              >
                <span>Click here if redirect doesn&apos;t start</span>
                <span>&rarr;</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-full border border-[var(--border-color)] bg-[var(--bg)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:outline-none focus:border-[var(--accent)] transition-all"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[var(--accent)] hover:opacity-90 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap"
                >
                  {status === 'loading' ? 'Connecting...' : 'Subscribe'}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-2 font-mono">
                <span>Substack Verified</span>
                <a
                  href={substackBaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Open Substack</span>
                  <span>↗</span>
                </a>
              </div>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-2 text-xs text-red-500 font-mono text-center">{message}</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default SubscribeForm;
