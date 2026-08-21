'use client';

import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import Link from 'next/link';
import { IssueSummary } from '@/types';
import { formatDate, formatIssueBadge } from '@/lib/utils';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: IssueSummary[];
}

export function CommandSearchModal({ isOpen, onClose, issues }: CommandSearchModalProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    if (!deferredQuery.trim()) return issues.slice(0, 5);
    const q = deferredQuery.toLowerCase().trim();
    return issues.filter((issue) => {
      const badgeText = formatIssueBadge(issue.nodeType, issue.issueNumber).toLowerCase();
      const nodeTypeText = (issue.nodeType || 'daily-node').toLowerCase();

      return (
        issue.title.toLowerCase().includes(q) ||
        (issue.subtitle && issue.subtitle.toLowerCase().includes(q)) ||
        issue.excerpt.toLowerCase().includes(q) ||
        issue.topics.some((t) => t.toLowerCase().includes(q)) ||
        issue.tags.some((t) => t.toLowerCase().includes(q)) ||
        nodeTypeText.includes(q) ||
        badgeText.includes(q)
      );
    });
  }, [issues, deferredQuery]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-start justify-center pt-16 md:pt-24 p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command search palette"
    >
      <div
        className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="relative flex items-center border-b border-[var(--border-color)] px-6 py-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)] mr-3 shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="command-search-input"
            type="text"
            autoFocus
            maxLength={200}
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, 200))}
            aria-label="Search dispatches and topics"
            placeholder="Search dispatches, topics, keywords (e.g., The Daily Nodes #001, RAG, Agents)..."
            className="w-full bg-transparent text-lg font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg)] transition-colors ml-2 cursor-pointer"
          >
            <kbd className="text-xs font-mono px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg)]">Esc</kbd>
          </button>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[60vh]">
          <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] font-bold flex justify-between">
            <span>{query ? 'Matching Dispatches' : 'Recent Briefings'}</span>
            <span>{filtered.length} results</span>
          </div>

          {filtered.length > 0 ? (
            filtered.map((issue) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.slug}`}
                onClick={onClose}
                className="group block p-4 rounded-2xl border border-transparent hover:border-[var(--accent)] hover:bg-[var(--bg)] transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3 text-xs font-mono mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--accent)]">
                      {formatIssueBadge(issue.nodeType, issue.issueNumber)}
                    </span>
                  </div>
                  <time dateTime={issue.date} className="text-[var(--text-secondary)]">{formatDate(issue.date)}</time>
                </div>

                <h4 className="font-serif font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {issue.title}
                </h4>

                {issue.subtitle && (
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-1 italic mt-1 font-medium">
                    {issue.subtitle}
                  </p>
                )}
              </Link>
            ))
          ) : (
            <div className="py-12 text-center text-[var(--text-secondary)]">
              <p className="text-sm font-medium mb-1">No dispatches found for &quot;{query}&quot;</p>
              <p className="text-xs">Try searching for &quot;AI Agents&quot;, &quot;RAG&quot;, or &quot;Daily Nodes&quot;.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[var(--border-color)] px-6 py-3 bg-[var(--bg)]/50 text-xs font-mono text-[var(--text-secondary)] flex justify-between items-center">
          <span>Press <kbd className="px-1.5 py-0.5 rounded border border-[var(--border-color)] bg-[var(--surface)] font-bold">Esc</kbd> to exit</span>
          <Link href="/search" onClick={onClose} className="text-[var(--accent)] hover:underline font-semibold">
            Open full search archive &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CommandSearchModal;
