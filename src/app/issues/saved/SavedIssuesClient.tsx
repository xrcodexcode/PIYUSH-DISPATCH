'use client';

import React, { useState, useEffect } from 'react';
import { Issue } from '@/types';
import IssueCard from '@/components/IssueCard';
import Link from 'next/link';
import { sanitizeSlug } from '@/lib/security';
import { SavedHighlight } from '@/components/QuoteShareTooltip';
import { cn, formatDate } from '@/lib/utils';

interface SavedIssuesClientProps {
  allIssues: Issue[];
}

export function SavedIssuesClient({ allIssues }: SavedIssuesClientProps) {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'highlights'>('bookmarks');
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [savedHighlights, setSavedHighlights] = useState<SavedHighlight[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    const loadVaultData = () => {
      try {
        // 1. Load saved issue slugs
        const rawSlugs = localStorage.getItem('saved_dispatches');
        if (!rawSlugs) {
          setSavedSlugs([]);
        } else {
          const parsed = JSON.parse(rawSlugs);
          if (Array.isArray(parsed)) {
            const clean = parsed
              .map(sanitizeSlug)
              .filter((s): s is string => Boolean(s) && s.length > 0);
            setSavedSlugs(clean);
          } else {
            setSavedSlugs([]);
          }
        }

        // 2. Load saved highlights
        const rawHighlights = localStorage.getItem('saved_highlights');
        if (!rawHighlights) {
          setSavedHighlights([]);
        } else {
          const parsedH = JSON.parse(rawHighlights);
          if (Array.isArray(parsedH)) {
            setSavedHighlights(parsedH);
          } else {
            setSavedHighlights([]);
          }
        }
      } catch {
        setSavedSlugs([]);
        setSavedHighlights([]);
      }
      setIsLoaded(true);
    };

    loadVaultData();
    window.addEventListener('saved-dispatches-updated', loadVaultData);
    window.addEventListener('saved-highlights-updated', loadVaultData);

    return () => {
      window.removeEventListener('saved-dispatches-updated', loadVaultData);
      window.removeEventListener('saved-highlights-updated', loadVaultData);
    };
  }, []);

  const handleDeleteHighlight = (id: string) => {
    try {
      const updated = savedHighlights.filter(h => h.id !== id);
      setSavedHighlights(updated);
      localStorage.setItem('saved_highlights', JSON.stringify(updated));
    } catch {
      // safe fallback
    }
  };

  const handleExportMarkdown = () => {
    if (savedHighlights.length === 0) return;

    let mdContent = `# Piyush's Dispatch — Personal Highlights & Vault Notes\n`;
    mdContent += `*Exported on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

    savedHighlights.forEach((h, index) => {
      mdContent += `### ${index + 1}. [${h.issueTitle}](https://dispatch.piyush.dev/issues/${h.issueSlug})\n`;
      mdContent += `> "${h.text}"\n\n`;
      mdContent += `*Clipped on ${new Date(h.date).toLocaleDateString()}*\n\n---\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `piyushs-dispatch-highlights-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyAllHighlights = async () => {
    if (savedHighlights.length === 0) return;

    let textToCopy = `Piyush's Dispatch — Highlights & Notes\n\n`;
    savedHighlights.forEach((h) => {
      textToCopy += `> "${h.text}"\n— ${h.issueTitle} (https://dispatch.piyush.dev/issues/${h.issueSlug})\n\n`;
    });

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // safe fallback
    }
  };

  const savedIssues = allIssues.filter(issue => savedSlugs.includes(issue.slug));

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-[var(--text-secondary)] font-mono text-sm">
        Loading personal vault...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full">
      {/* Vault Tabs Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2 p-1 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-2xs">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'bookmarks'
                ? "bg-[var(--accent)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <span>🔖 Dispatches</span>
            <span className={cn(
              "px-1.5 py-0.2 rounded-full text-[10px]",
              activeTab === 'bookmarks' ? "bg-white/20 text-white" : "bg-[var(--bg)] text-[var(--text-secondary)]"
            )}>
              {savedIssues.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('highlights')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'highlights'
                ? "bg-[var(--accent)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <span>✨ Highlights &amp; Clips</span>
            <span className={cn(
              "px-1.5 py-0.2 rounded-full text-[10px]",
              activeTab === 'highlights' ? "bg-white/20 text-white" : "bg-[var(--bg)] text-[var(--text-secondary)]"
            )}>
              {savedHighlights.length}
            </span>
          </button>
        </div>

        {activeTab === 'highlights' && savedHighlights.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAllHighlights}
              className="px-3.5 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface)] text-xs font-mono font-medium hover:border-[var(--accent)] text-[var(--text-primary)] transition-all cursor-pointer shadow-2xs flex items-center gap-1"
            >
              <span>{copiedAll ? '✓ Copied All' : 'Copy All'}</span>
            </button>
            <button
              onClick={handleExportMarkdown}
              className="px-4 py-1.5 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-bold hover:opacity-90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Export to Markdown (.md)</span>
              <span>↓</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Bookmarked Dispatches */}
      {activeTab === 'bookmarks' && (
        <>
          {savedIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedIssues.map((issue) => (
                <IssueCard key={issue.slug} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="text-4xl">🔖</div>
              <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">No bookmarked dispatches</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Click the &quot;Save Issue&quot; button on any dispatch to bookmark it for offline reading and quick technical reference.
              </p>
              <Link
                href="/issues"
                className="inline-block bg-[var(--accent)] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Explore All Issues &rarr;
              </Link>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Saved Highlights & Quotes */}
      {activeTab === 'highlights' && (
        <>
          {savedHighlights.length > 0 ? (
            <div className="space-y-4">
              {savedHighlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="p-5 md:p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-primary)] space-y-3 relative group hover:border-[var(--accent)] transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-3 text-xs font-mono text-[var(--text-secondary)]">
                    <Link
                      href={`/issues/${highlight.issueSlug}`}
                      className="font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
                    >
                      <span>From: {highlight.issueTitle}</span>
                      <span>&rarr;</span>
                    </Link>
                    <div className="flex items-center gap-3">
                      <span>{formatDate(highlight.date)}</span>
                      <button
                        onClick={() => handleDeleteHighlight(highlight.id)}
                        className="text-red-400 hover:text-red-600 font-mono text-[10px] p-1 rounded hover:bg-[var(--bg)] cursor-pointer"
                        title="Delete highlight"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <blockquote className="border-l-3 border-[var(--accent)] pl-4 py-1 italic font-serif text-base md:text-lg text-[var(--text-primary)] leading-relaxed bg-[var(--bg)]/40 rounded-r-xl">
                    &quot;{highlight.text}&quot;
                  </blockquote>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="text-4xl">✨</div>
              <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">No highlights saved yet</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Highlight any sentence or paragraph in a dispatch, and click the floating <strong>Clip</strong> button to save key mental models to your personal vault.
              </p>
              <Link
                href="/issues"
                className="inline-block bg-[var(--accent)] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Browse Dispatches &rarr;
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SavedIssuesClient;
