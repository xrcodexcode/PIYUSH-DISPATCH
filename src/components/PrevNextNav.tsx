import React from 'react';
import Link from 'next/link';
import { Issue } from '@/types';
import { formatIssueBadge } from '@/lib/utils';

interface PrevNextNavProps {
  previousIssue: Issue | null;
  nextIssue: Issue | null;
}

export function PrevNextNav({ previousIssue, nextIssue }: PrevNextNavProps) {
  if (!previousIssue && !nextIssue) return null;

  return (
    <nav className="mt-16 pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between gap-6">
      {/* 1. Next Issue (Placed FIRST as requested) */}
      <div className="flex-1">
        {nextIssue ? (
          <Link 
            href={`/issues/${nextIssue.slug}`}
            className="group block p-6 border border-[var(--accent)]/40 rounded-2xl transition-all bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-lg relative overflow-hidden"
          >
            <div className="text-xs font-mono text-[var(--accent)] uppercase tracking-wider mb-2 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>Next Dispatch</span>
                <span aria-hidden="true">&rarr;</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px]">Up Next</span>
            </div>
            <div className="font-mono text-xs text-[var(--accent)] mb-1 font-semibold flex items-center gap-2">
              <span>{formatIssueBadge(nextIssue.nodeType, nextIssue.issueNumber)}</span>
              {nextIssue.readingTime > 0 && (
                <span className="text-[var(--text-secondary)] font-normal">• {nextIssue.readingTime} min read</span>
              )}
            </div>
            <h4 className="font-serif font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
              {nextIssue.title}
            </h4>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* 2. Previous Issue */}
      <div className="flex-1">
        {previousIssue && (
          <Link 
            href={`/issues/${previousIssue.slug}`}
            className="group block p-6 border border-[var(--border-color)] rounded-2xl transition-all bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-md"
          >
            <div className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span aria-hidden="true">&larr;</span> Previous Dispatch
            </div>
            <div className="font-mono text-xs text-[var(--text-secondary)] mb-1 font-semibold flex items-center gap-2">
              <span>{formatIssueBadge(previousIssue.nodeType, previousIssue.issueNumber)}</span>
              {previousIssue.readingTime > 0 && (
                <span className="text-[var(--text-secondary)] font-normal">• {previousIssue.readingTime} min read</span>
              )}
            </div>
            <h4 className="font-serif font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
              {previousIssue.title}
            </h4>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default PrevNextNav;
