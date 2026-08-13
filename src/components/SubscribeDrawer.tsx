'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export function SubscribeDrawer() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const substackBaseUrl = 'https://xrcodex.substack.com/subscribe';
  const dismissedRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!dismissedRef.current && window.scrollY > 400) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('subscribe-drawer-dismissed') === 'true';
    dismissedRef.current = isDismissed;

    if (!isDismissed) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    return undefined;
  }, [handleScroll]);

  const handleDismiss = () => {
    dismissedRef.current = true;
    setIsVisible(false);
    sessionStorage.setItem('subscribe-drawer-dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);

    const substackUrl = `${substackBaseUrl}?email=${encodeURIComponent(email)}`;

    try {
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'sticky-drawer' }),
      }).catch(() => {});
    } catch {
      // Fallback
    }

    window.open(substackUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      window.location.href = substackUrl;
      handleDismiss();
    }, 600);
  };

  if (!isVisible) return null;

  return (
    <aside className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-slideUp">
      <div className="bg-[var(--surface)] border border-[var(--border-color)] p-5 rounded-2xl shadow-2xl backdrop-blur-md relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-full hover:bg-[var(--bg)] transition-colors cursor-pointer"
          aria-label="Dismiss newsletter drawer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-3 space-y-1">
            <div className="text-2xl">⚡</div>
            <h4 className="font-bold text-[var(--text-primary)] text-sm">Redirecting to Substack...</h4>
            <p className="text-xs text-[var(--text-secondary)]">Confirming your subscription on xrcodex.substack.com.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 text-[10px] font-mono font-bold uppercase tracking-wider border border-orange-500/20">
                Substack Connected
              </span>
              <span className="text-[11px] font-mono text-[var(--text-secondary)]">xrcodex.substack.com</span>
            </div>

            <div>
              <h4 className="font-serif font-bold text-[var(--text-primary)] text-base">Enjoying this dispatch?</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Get new deep dives & daily nodes delivered straight to your inbox via Substack.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="flex-1 bg-[var(--bg)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                className="bg-[var(--accent)] hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-semibold shrink-0 shadow-xs cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}

export default SubscribeDrawer;
