'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { sanitizeSlug } from '@/lib/security';

interface QuoteShareTooltipProps {
  issueSlug: string;
  issueTitle: string;
}

export interface SavedHighlight {
  id: string;
  issueSlug: string;
  issueTitle: string;
  text: string;
  date: string;
}

export function QuoteShareTooltip({ issueSlug, issueTitle }: QuoteShareTooltipProps) {
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [highlightSaved, setHighlightSaved] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const cleanSlug = sanitizeSlug(issueSlug);

  const handleSelection = useCallback(() => {
    if (typeof window === 'undefined') return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setPosition(null);
      setSelectedText('');
      setCopied(false);
      setHighlightSaved(false);
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 6 || text.length > 500) {
      setPosition(null);
      setSelectedText('');
      return;
    }

    // Ensure the selection is within article prose
    const anchorNode = selection.anchorNode;
    const proseParent = anchorNode?.parentElement?.closest('.prose');
    if (!proseParent) {
      setPosition(null);
      setSelectedText('');
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      setPosition(null);
      return;
    }

    setSelectedText(text);
    setPosition({
      top: rect.top + window.scrollY - 48,
      left: Math.max(16, rect.left + rect.width / 2),
    });
  }, []);

  useEffect(() => {
    const onMouseUp = () => setTimeout(handleSelection, 20);
    const onKeyUp = () => setTimeout(handleSelection, 20);

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [handleSelection]);

  const getArticleUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href.split('#')[0];
    }
    return `https://dispatch.piyush.dev/issues/${cleanSlug}`;
  };

  const handleQuoteOnX = () => {
    if (!selectedText) return;
    const articleUrl = getArticleUrl();
    const truncatedText = selectedText.length > 200 ? `${selectedText.slice(0, 197)}...` : selectedText;
    const tweetText = `“${truncatedText}”\n\n— via Piyush's Dispatch`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(articleUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyQuote = async () => {
    if (!selectedText) return;
    const articleUrl = getArticleUrl();
    const markdownQuote = `> "${selectedText}"\n>\n> — [${issueTitle}](${articleUrl})`;
    
    try {
      await navigator.clipboard.writeText(markdownQuote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // safe fallback
    }
  };

  const handleSaveHighlight = () => {
    if (!selectedText || !cleanSlug) return;

    try {
      const raw = localStorage.getItem('saved_highlights');
      let existing: SavedHighlight[] = [];
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          existing = parsed.filter((h): h is SavedHighlight => 
            Boolean(h && typeof h === 'object' && typeof h.id === 'string' && typeof h.text === 'string')
          );
        }
      }
      
      const newHighlight: SavedHighlight = {
        id: `${cleanSlug}-${Date.now()}`,
        issueSlug: cleanSlug,
        issueTitle: sanitizeSlug(issueTitle) ? issueTitle.slice(0, 120) : 'Dispatch Note',
        text: selectedText.slice(0, 500),
        date: new Date().toISOString(),
      };

      const updated = [newHighlight, ...existing.filter(h => h.text !== selectedText)].slice(0, 100);
      localStorage.setItem('saved_highlights', JSON.stringify(updated));
      window.dispatchEvent(new Event('saved-highlights-updated'));
      
      setHighlightSaved(true);
      setTimeout(() => setHighlightSaved(false), 2000);
    } catch {
      // safe fallback on storage quota or parsing errors
    }
  };

  if (!position || !selectedText) return null;

  return (
    <div
      ref={tooltipRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
      className="absolute z-[1000] flex items-center gap-1.5 p-1 rounded-full bg-[var(--surface)] border border-[var(--border-color)] shadow-2xl backdrop-blur-md animate-fadeIn transition-all"
    >
      {/* 1. Share on X */}
      <button
        onClick={handleQuoteOnX}
        title="Quote snippet on X"
        aria-label="Quote on X"
        className="px-2.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1 text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
        <span>Quote</span>
      </button>

      <div className="w-[1px] h-4 bg-[var(--border-color)]" />

      {/* 2. Copy Quote */}
      <button
        onClick={handleCopyQuote}
        title={copied ? "Copied to clipboard!" : "Copy markdown quote with citation link"}
        aria-label="Copy markdown quote"
        className={cn(
          "px-2.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer",
          copied
            ? "bg-green-500/10 text-green-500"
            : "text-[var(--text-primary)] hover:bg-[var(--border-color)]"
        )}
      >
        {copied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>Copy</span>
          </>
        )}
      </button>

      <div className="w-[1px] h-4 bg-[var(--border-color)]" />

      {/* 3. Highlight & Save to Personal Vault */}
      <button
        onClick={handleSaveHighlight}
        title={highlightSaved ? "Highlight saved to personal vault!" : "Save quote to My Highlights in Personal Vault"}
        aria-label="Save highlight"
        className={cn(
          "px-2.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer",
          highlightSaved
            ? "bg-amber-500/20 text-amber-500"
            : "text-[var(--text-primary)] hover:bg-[var(--border-color)]"
        )}
      >
        <span>{highlightSaved ? '✨ Saved!' : '🔖 Clip'}</span>
      </button>
    </div>
  );
}

export default QuoteShareTooltip;
