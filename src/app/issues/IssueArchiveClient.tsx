'use client';

import { useState, useMemo, useDeferredValue, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { IssueSummary } from '@/types';
import IssueCard from '@/components/IssueCard';
import SearchBar from '@/components/SearchBar';
interface IssueArchiveClientProps {
  initialIssues: IssueSummary[];
}

type SortOption = 'newest' | 'oldest' | 'shortest' | 'longest';

export default function IssueArchiveClient({ initialIssues }: IssueArchiveClientProps) {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || searchParams.get('format');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState<'daily-node' | 'deep-node' | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    if (typeParam === 'daily-node' || typeParam === 'deep-node') {
      queueMicrotask(() => setSelectedNodeType(typeParam));
    } else if (!typeParam) {
      queueMicrotask(() => setSelectedNodeType(null));
    }
  }, [typeParam]);

  // Defer search filtering for instant typing
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Filter & Sort Engine
  const filteredIssues = useMemo(() => {
    let filtered = [...initialIssues];
    
    // 1. Node type filter
    if (selectedNodeType) {
      filtered = filtered.filter(issue => (issue.nodeType || 'daily-node') === selectedNodeType);
    }

    // 2. Search query filter
    if (deferredSearchQuery.trim()) {
      const q = deferredSearchQuery.toLowerCase();
      filtered = filtered.filter(issue => {
        const badgeText = `the daily nodes #${String(issue.issueNumber).padStart(3, '0')}`.toLowerCase();
        const rawBadgeText = `daily-nodes#${String(issue.issueNumber).padStart(3, '0')}`.toLowerCase();
        const nodeTypeText = (issue.nodeType || 'daily-node').toLowerCase();
        const nodeTypeDisplay = nodeTypeText === 'deep-node' ? 'deep node' : 'daily node';
        const altNodeText = `node-${issue.issueNumber}`.toLowerCase();
        const altNodeSpaceText = `node ${issue.issueNumber}`.toLowerCase();

        return (
          issue.title.toLowerCase().includes(q) || 
          (issue.subtitle && issue.subtitle.toLowerCase().includes(q)) ||
          issue.excerpt.toLowerCase().includes(q) ||
          issue.topics.some(t => t.toLowerCase().includes(q)) ||
          issue.tags.some(t => t.toLowerCase().includes(q)) ||
          nodeTypeText.includes(q) ||
          nodeTypeDisplay.includes(q) ||
          badgeText.includes(q) ||
          rawBadgeText.includes(q) ||
          altNodeText.includes(q) ||
          altNodeSpaceText.includes(q)
        );
      });
    }

    // 3. Sort engine
    filtered.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortOption === 'shortest') {
        return a.readingTime - b.readingTime;
      }
      if (sortOption === 'longest') {
        return b.readingTime - a.readingTime;
      }
      return 0;
    });
    
    return filtered;
  }, [initialIssues, deferredSearchQuery, selectedNodeType, sortOption]);

  const visibleIssues = filteredIssues.slice(0, visibleCount);
  const hasMore = visibleCount < filteredIssues.length;

  return (
    <div className="space-y-8 w-full">
      {/* Search & Filter Controls Bar */}
      <div className="bg-[var(--surface)] p-4 md:p-6 rounded-3xl border border-[var(--border-color)] shadow-2xs space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search dispatches, keywords..."
        />

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)] text-xs font-mono">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-secondary)] font-medium">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-[var(--bg)] border border-[var(--border-color)] text-[var(--text-primary)] px-3 py-1.5 rounded-xl focus:outline-none focus:border-[var(--accent)] font-semibold cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="shortest">Shortest Read (&lt;5 min)</option>
              <option value="longest">Deep Dives (&gt;8 min)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
        <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
          {searchQuery ? `Results for "${searchQuery}"` : 'Vault Archive'}
        </h2>
        <span className="text-xs font-mono text-[var(--text-secondary)]">
          {filteredIssues.length} {filteredIssues.length === 1 ? 'dispatch' : 'dispatches'}
        </span>
      </div>

      {/* Grid */}
      {visibleIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleIssues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-[var(--surface)] rounded-3xl border border-[var(--border-color)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-[var(--text-secondary)] opacity-50"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-2">No matching dispatches found</h3>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t find any issues matching your search filters. Try clearing your filters or search terms.
          </p>
          <button
            onClick={() => { setSearchQuery(''); }}
            className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Clear all search filters
          </button>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="px-8 py-3.5 rounded-full border border-[var(--border-color)] bg-[var(--surface)] font-semibold text-sm text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-xs"
          >
            Load More Dispatches ({filteredIssues.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
