'use client';

import { useState, useMemo, useDeferredValue, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { IssueSummary } from '@/types';
import IssueCard from '@/components/IssueCard';
import SearchBar from '@/components/SearchBar';
import { cn } from '@/lib/utils';
import { sanitizeSlug } from '@/lib/security';

interface IssueArchiveClientProps {
  initialIssues: IssueSummary[];
}

type SortOption = 'newest' | 'oldest' | 'shortest' | 'longest';
type ReadFilterOption = 'all' | 'unread' | 'read';

export default function IssueArchiveClient({ initialIssues }: IssueArchiveClientProps) {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || searchParams.get('format');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<'daily-node' | 'deep-node' | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [readFilter, setReadFilter] = useState<ReadFilterOption>('all');
  const [readSlugs, setReadSlugs] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);

  // Load read status list
  useEffect(() => {
    const loadReadList = () => {
      try {
        const raw = localStorage.getItem('read_dispatches');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setReadSlugs(parsed.map(sanitizeSlug).filter(Boolean));
          }
        }
      } catch {
        // safe fallback
      }
    };

    loadReadList();
    window.addEventListener('read-dispatches-updated', loadReadList);
    return () => window.removeEventListener('read-dispatches-updated', loadReadList);
  }, []);

  useEffect(() => {
    if (typeParam === 'daily-node' || typeParam === 'deep-node') {
      setSelectedNodeType(typeParam);
    } else if (!typeParam) {
      setSelectedNodeType(null);
    }
  }, [typeParam]);

  // Defer search filtering for instant typing
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Extract unique topics from issues
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    initialIssues.forEach(issue => {
      issue.topics.forEach(topic => topics.add(topic));
    });
    return Array.from(topics).sort();
  }, [initialIssues]);

  // Filter & Sort Engine
  const filteredIssues = useMemo(() => {
    let filtered = [...initialIssues];
    
    // 1. Node type filter
    if (selectedNodeType) {
      filtered = filtered.filter(issue => (issue.nodeType || 'daily-node') === selectedNodeType);
    }

    // 2. Topic filter
    if (selectedTopic) {
      filtered = filtered.filter(issue => issue.topics.includes(selectedTopic));
    }

    // 3. Read status filter
    if (readFilter === 'read') {
      filtered = filtered.filter(issue => readSlugs.includes(sanitizeSlug(issue.slug)));
    } else if (readFilter === 'unread') {
      filtered = filtered.filter(issue => !readSlugs.includes(sanitizeSlug(issue.slug)));
    }

    // 4. Search query filter
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

    // 5. Sort engine
    filtered.sort((a, b) => {
      if (sortOption === 'newest') {
        return b.issueNumber - a.issueNumber || new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortOption === 'oldest') {
        return a.issueNumber - b.issueNumber || new Date(a.date).getTime() - new Date(b.date).getTime();
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
  }, [initialIssues, deferredSearchQuery, selectedTopic, selectedNodeType, readFilter, readSlugs, sortOption]);

  const visibleIssues = filteredIssues.slice(0, visibleCount);
  const hasMore = visibleCount < filteredIssues.length;

  return (
    <div className="space-y-8 w-full">
      {/* Search & Filter Controls Bar */}
      <div className="bg-[var(--surface)] p-4 md:p-6 rounded-3xl border border-[var(--border-color)] shadow-2xs space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search dispatches, topics, keywords..."
        />

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)] text-xs font-mono">
          {/* Read Status Tabs */}
          <div className="flex items-center gap-1 bg-[var(--bg)] p-1 rounded-xl border border-[var(--border-color)]">
            {(
              [
                { id: 'all', label: 'All Dispatches' },
                { id: 'unread', label: 'Unread' },
                { id: 'read', label: 'Completed' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReadFilter(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                  readFilter === tab.id
                    ? "bg-[var(--accent)] text-white shadow-2xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

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

        {/* Topic Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <button
            onClick={() => setSelectedTopic(null)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer border",
              selectedTopic === null
                ? "bg-[var(--accent)] text-white border-[var(--accent)] font-bold shadow-2xs"
                : "bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent)]"
            )}
          >
            All Topics
          </button>
          {allTopics.slice(0, 8).map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer border",
                selectedTopic === topic
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] font-bold shadow-2xs"
                  : "bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
              )}
            >
              #{topic}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
        <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
          {searchQuery ? `Results for "${searchQuery}"` : selectedTopic ? `#${selectedTopic} Dispatches` : 'Vault Archive'}
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
            onClick={() => { setSearchQuery(''); setSelectedTopic(null); setReadFilter('all'); }}
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
