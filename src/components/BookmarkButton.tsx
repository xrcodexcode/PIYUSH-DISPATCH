'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { sanitizeSlug } from '@/lib/security';

interface BookmarkButtonProps {
  slug: string;
  className?: string;
  compact?: boolean;
}

function getSafeSavedBookmarks(): string[] {
  try {
    const raw = localStorage.getItem('saved_dispatches');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(sanitizeSlug)
      .filter((s): s is string => Boolean(s) && s.length > 0)
      .slice(0, 200);
  } catch {
    return [];
  }
}

export function BookmarkButton({ slug, className, compact = false }: BookmarkButtonProps) {
  const cleanSlug = sanitizeSlug(slug);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!cleanSlug) return;
    const updateState = () => {
      const saved = getSafeSavedBookmarks();
      setIsBookmarked(saved.includes(cleanSlug));
    };
    updateState();
    window.addEventListener('saved-dispatches-updated', updateState);
    return () => window.removeEventListener('saved-dispatches-updated', updateState);
  }, [cleanSlug]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cleanSlug) return;

    try {
      const saved = getSafeSavedBookmarks();
      let updated: string[];

      if (saved.includes(cleanSlug)) {
        updated = saved.filter(s => s !== cleanSlug);
        setIsBookmarked(false);
      } else {
        updated = [...saved, cleanSlug].slice(0, 200);
        setIsBookmarked(true);
      }

      localStorage.setItem('saved_dispatches', JSON.stringify(updated));
      window.dispatchEvent(new Event('saved-dispatches-updated'));
    } catch {
      // Safe no-op on storage quota or access denial
    }
  };


  if (compact) {
    return (
      <button
        onClick={toggleBookmark}
        className={cn(
          "p-1.5 rounded-full transition-colors relative z-10",
          isBookmarked
            ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]",
          className
        )}
        title={isBookmarked ? "Remove from saved dispatches" : "Save dispatch to personal vault"}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark dispatch"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggleBookmark}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all border flex items-center gap-1.5 shadow-2xs relative z-10",
        isBookmarked
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
          : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]",
        className
      )}
      title={isBookmarked ? "Saved in personal vault" : "Save dispatch"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span>{isBookmarked ? "Saved" : "Save Issue"}</span>
    </button>
  );
}

export default BookmarkButton;
