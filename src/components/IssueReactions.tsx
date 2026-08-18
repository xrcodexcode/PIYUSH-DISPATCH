'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { sanitizeSlug } from '@/lib/security';

interface IssueReactionsProps {
  slug: string;
}

type ReactionType = 'signal' | 'actionable' | 'paradigm' | 'deep' | 'engaging';

interface ReactionConfig {
  id: ReactionType;
  emoji: string;
  label: string;
  defaultCount: number;
}

const REACTIONS: ReactionConfig[] = [
  { id: 'signal', emoji: '🧠', label: 'High Signal', defaultCount: 18 },
  { id: 'actionable', emoji: '💡', label: 'Actionable', defaultCount: 14 },
  { id: 'paradigm', emoji: '🚀', label: 'Paradigm Shift', defaultCount: 9 },
  { id: 'deep', emoji: '🔬', label: 'Deep Tech', defaultCount: 12 },
  { id: 'engaging', emoji: '☕', label: 'Weekend Read', defaultCount: 8 },
];

export function IssueReactions({ slug }: IssueReactionsProps) {
  const cleanSlug = sanitizeSlug(slug);
  const [userReactions, setUserReactions] = useState<Set<ReactionType>>(new Set());
  const [counts, setCounts] = useState<Record<ReactionType, number>>({
    signal: 18,
    actionable: 14,
    paradigm: 9,
    deep: 12,
    engaging: 8,
  });
  const [animatedId, setAnimatedId] = useState<ReactionType | null>(null);

  useEffect(() => {
    try {
      const storageKey = `reactions_${cleanSlug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userSelected && Array.isArray(parsed.userSelected)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUserReactions(new Set(parsed.userSelected));
        }
        if (parsed.counts) {
          setCounts(parsed.counts);
        }
      }
    } catch {
      // safe fallback
    }
  }, [cleanSlug]);

  const toggleReaction = (id: ReactionType) => {
    const nextSelected = new Set(userReactions);
    const nextCounts = { ...counts };

    if (nextSelected.has(id)) {
      nextSelected.delete(id);
      nextCounts[id] = Math.max(0, nextCounts[id] - 1);
    } else {
      nextSelected.add(id);
      nextCounts[id] = nextCounts[id] + 1;
      setAnimatedId(id);
      setTimeout(() => setAnimatedId(null), 600);
    }

    setUserReactions(nextSelected);
    setCounts(nextCounts);

    try {
      const storageKey = `reactions_${cleanSlug}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          userSelected: Array.from(nextSelected),
          counts: nextCounts,
        })
      );
    } catch {
      // safe no-op
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] shadow-2xs space-y-4 text-center">
      <div className="flex flex-col items-center gap-1">
        <h4 className="font-serif text-lg md:text-xl font-bold text-[var(--text-primary)]">
          How did this dispatch land?
        </h4>
        <p className="text-xs font-mono text-[var(--text-secondary)]">
          Click to add your reaction • Community pulse
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {REACTIONS.map((r) => {
          const isSelected = userReactions.has(r.id);
          const isBouncing = animatedId === r.id;

          return (
            <button
              key={r.id}
              onClick={() => toggleReaction(r.id)}
              className={cn(
                "px-3.5 py-2 rounded-2xl border text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs",
                isSelected
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs scale-105"
                  : "bg-[var(--bg)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--accent)] hover:bg-[var(--surface)]",
                isBouncing && "animate-bounce"
              )}
            >
              <span className="text-base leading-none">{r.emoji}</span>
              <span className="font-semibold">{r.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                  isSelected ? "bg-white/20 text-white" : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                )}
              >
                {counts[r.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default IssueReactions;
