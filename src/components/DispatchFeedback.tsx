'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { sanitizeSlug } from '@/lib/security';

interface DispatchFeedbackProps {
  slug: string;
}

const ALLOWED_VOTES = ['exceptional', 'learned', 'needs-work'] as const;
type ValidVote = typeof ALLOWED_VOTES[number];

export function DispatchFeedback({ slug }: DispatchFeedbackProps) {
  const cleanSlug = sanitizeSlug(slug);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!cleanSlug) return;
    try {
      const savedVote = localStorage.getItem(`feedback-${cleanSlug}`);
      if (savedVote && (ALLOWED_VOTES as readonly string[]).includes(savedVote)) {
        setSelectedVote(savedVote);
        setHasVoted(true);
      }
    } catch {
      // ignore
    }
  }, [cleanSlug]);

  const handleVote = (vote: ValidVote) => {
    if (!cleanSlug) return;
    setSelectedVote(vote);
    setHasVoted(true);
    try {
      localStorage.setItem(`feedback-${cleanSlug}`, vote);
    } catch {
      // ignore
    }
  };


  return (
    <div className="w-full bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 text-center shadow-xs transition-all">
      <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-2">
        Was this briefing valuable?
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
        Your vote helps improve the signal-to-noise ratio for future dispatches.
      </p>

      {hasVoted ? (
        <div className="bg-[var(--bg)] border border-[var(--border-color)] py-4 px-6 rounded-2xl max-w-md mx-auto text-center space-y-1 animate-fadeIn">
          <div className="text-xl">🙌</div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Thank you for rating this dispatch!
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Your feedback has been logged to the engineering vault.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
          <button
            onClick={() => handleVote('exceptional')}
            className="flex-1 min-w-[130px] px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-2xs group"
          >
            <span className="text-base block mb-0.5 group-hover:scale-110 transition-transform">🔥</span>
            Exceptional
          </button>
          <button
            onClick={() => handleVote('learned')}
            className="flex-1 min-w-[130px] px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-2xs group"
          >
            <span className="text-base block mb-0.5 group-hover:scale-110 transition-transform">💡</span>
            Learned Something
          </button>
          <button
            onClick={() => handleVote('needs-work')}
            className="flex-1 min-w-[130px] px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-2xs group"
          >
            <span className="text-base block mb-0.5 group-hover:scale-110 transition-transform">👎</span>
            Needs Improvement
          </button>
        </div>
      )}
    </div>
  );
}

export default DispatchFeedback;
