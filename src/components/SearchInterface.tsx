'use client';

import React, { useState, useMemo, useDeferredValue } from 'react';
import { IssueSummary } from '@/types';
import { IssueCard } from './IssueCard';
import SearchBar from './SearchBar';
import { cn } from '@/lib/utils';

interface SearchInterfaceProps {
  issues?: IssueSummary[];
  initialIssues?: IssueSummary[];
}

export function SearchInterface({ issues, initialIssues }: SearchInterfaceProps) {
  const allIssuesList = useMemo(() => issues || initialIssues || [], [issues, initialIssues]);
  const [query, setQuery] = useState('');
  const [activeNodeType, setActiveNodeType] = useState<'daily-node' | 'deep-node' | null>(null);

  const deferredQuery = useDeferredValue(query);

  const filteredIssues = useMemo(() => {
    let filtered = allIssuesList;
    if (activeNodeType) {
      filtered = filtered.filter(issue => (issue.nodeType || 'daily-node') === activeNodeType);
    }
    if (deferredQuery.trim()) {
      const q = deferredQuery.toLowerCase();
      filtered = filtered.filter(issue => {
        const badgeText = `the daily nodes #${String(issue.issueNumber).padStart(3, '0')}`.toLowerCase();
        const nodeTypeText = (issue.nodeType || 'daily-node').toLowerCase();
        const nodeTypeDisplay = nodeTypeText === 'deep-node' ? 'deep node' : 'daily node';

        return (
          issue.title.toLowerCase().includes(q) ||
          issue.subtitle.toLowerCase().includes(q) ||
          issue.excerpt.toLowerCase().includes(q) ||
          issue.topics.some(t => t.toLowerCase().includes(q)) ||
          issue.tags.some(t => t.toLowerCase().includes(q)) ||
          nodeTypeText.includes(q) ||
          nodeTypeDisplay.includes(q) ||
          badgeText.includes(q)
        );
      });
    }
    return filtered;
  }, [allIssuesList, deferredQuery, activeNodeType]);

  const hasActiveFilters = !!query || !!activeNodeType;

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          value={query}
          onChange={setQuery}
          autoFocus
          placeholder="Search dispatches, topics, keywords..."
        />
      </div>

      {/* Node Type Tabs */}
      <div className="flex items-center gap-1.5 bg-[var(--bg)] p-1 rounded-xl border border-[var(--border-color)] w-fit mb-8">
        {[
          { id: null, label: 'All' },
          { id: 'daily-node' as const, label: '⚡ Daily Nodes' },
          { id: 'deep-node' as const, label: '🧠 Deep Nodes' },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveNodeType(tab.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer",
              activeNodeType === tab.id
                ? "bg-[var(--accent)] text-white shadow-2xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="mb-6 pb-3 border-b border-[var(--border-color)] flex justify-between items-end">
        <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
          {query ? `Results for "${query}"` : 'All Dispatches'}
        </h2>
        <span className="text-sm font-mono text-[var(--text-secondary)]">
          {filteredIssues.length} {filteredIssues.length === 1 ? 'dispatch' : 'dispatches'}
        </span>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} variant="compact" />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-[var(--bg)] rounded-2xl border border-[var(--border-color)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-[var(--text-secondary)] mb-4 opacity-50">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-2">No dispatches found</h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto mb-6">
              No issues match your current filters. Try broadening your search.
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => { setQuery(''); setActiveNodeType(null); }}
                className="px-5 py-2.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchInterface;
