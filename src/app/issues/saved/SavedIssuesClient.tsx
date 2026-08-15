'use client';

import React, { useState, useEffect } from 'react';
import { Issue } from '@/types';
import IssueCard from '@/components/IssueCard';
import Link from 'next/link';
import { sanitizeSlug } from '@/lib/security';

interface SavedIssuesClientProps {
  allIssues: Issue[];
}

export function SavedIssuesClient({ allIssues }: SavedIssuesClientProps) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSaved = () => {
      try {
        const raw = localStorage.getItem('saved_dispatches');
        if (!raw) {
          setSavedSlugs([]);
        } else {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const clean = parsed
              .map(sanitizeSlug)
              .filter((s): s is string => Boolean(s) && s.length > 0);
            setSavedSlugs(clean);
          } else {
            setSavedSlugs([]);
          }
        }
      } catch {
        setSavedSlugs([]);
      }
      setIsLoaded(true);
    };

    loadSaved();
    window.addEventListener('saved-dispatches-updated', loadSaved);
    return () => window.removeEventListener('saved-dispatches-updated', loadSaved);
  }, []);


  const savedIssues = allIssues.filter(issue => savedSlugs.includes(issue.slug));

  if (!isLoaded) {
    return <div className="py-20 text-center text-[var(--text-secondary)] font-mono text-sm">Loading saved vault...</div>;
  }

  return (
    <div className="space-y-8">
      {savedIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedIssues.map((issue) => (
            <IssueCard key={issue.slug} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="text-4xl">🔖</div>
          <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">Your vault is empty</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Click the "Save Issue" button on any dispatch to bookmark it for offline reading and quick technical reference.
          </p>
          <Link
            href="/issues"
            className="inline-block bg-[var(--accent)] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Explore All Issues →
          </Link>
        </div>
      )}
    </div>
  );
}

export default SavedIssuesClient;
