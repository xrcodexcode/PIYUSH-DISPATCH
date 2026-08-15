'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { sanitizeSlug } from '@/lib/security';

interface ShareActionsProps {
  title: string;
  url?: string;
  substackUrl?: string;
  className?: string;
  variant?: 'inline' | 'sidebar' | 'horizontal';
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

export function ShareActions({ 
  title, 
  url, 
  substackUrl,
  className,
  variant = 'horizontal'
}: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeUrl = url || window.location.href;
      setCurrentUrl(activeUrl);
      
      const rawSlug = activeUrl.split('/issues/')[1]?.split('?')[0]?.split('#')[0] || '';
      const slug = sanitizeSlug(rawSlug);
      if (slug) {
        const saved = getSafeSavedBookmarks();
        setBookmarked(saved.includes(slug));
      }
    }
  }, [url]);

  const handleCopy = async () => {
    if (!currentUrl) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = currentUrl;
      input.setAttribute('readonly', '');
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmark = () => {
    if (typeof window === 'undefined') return;
    const rawSlug = (currentUrl || window.location.href).split('/issues/')[1]?.split('?')[0]?.split('#')[0] || '';
    const slug = sanitizeSlug(rawSlug);
    if (!slug) return;

    try {
      const saved = getSafeSavedBookmarks();
      let updated: string[];
      if (saved.includes(slug)) {
        updated = saved.filter(s => s !== slug);
        setBookmarked(false);
      } else {
        updated = [...saved, slug].slice(0, 200);
        setBookmarked(true);
      }
      localStorage.setItem('saved_dispatches', JSON.stringify(updated));
      window.dispatchEvent(new Event('saved-dispatches-updated'));
    } catch {
      // ignore
    }
  };


  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(`" ${title} " via Piyush's Dispatch`);

  const xShareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedInShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsAppShareLink = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const substackLink = substackUrl || "https://xrcodex.substack.com";

  return (
    <div className={cn("flex flex-col gap-2.5 w-full", className)}>
      <h3 className="font-mono font-bold text-xs tracking-wider uppercase text-[var(--text-secondary)]">
        Share Dispatch
      </h3>
      
      {/* 6 Icons Single-Row Grid - Fits cleanly in 288px sidebar without clipping */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* 1. Read on Substack */}
        <a 
          href={substackLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read on Substack"
          title="Read on Substack (xrcodex)"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-all shadow-2xs shrink-0 cursor-pointer"
        >
          <span className="text-sm">🍊</span>
        </a>

        {/* 2. Share on X */}
        <a 
          href={xShareLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          title="Share on X (Twitter)"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-2xs shrink-0 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
            <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
          </svg>
        </a>
        
        {/* 3. Share on LinkedIn */}
        <a 
          href={linkedInShareLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-2xs shrink-0 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>

        {/* 4. Share on WhatsApp */}
        <a 
          href={whatsAppShareLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          title="Share via WhatsApp"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-2xs shrink-0 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
        </a>
        
        {/* 5. Copy Link (100% Guaranteed Visible) */}
        <button 
          onClick={handleCopy}
          aria-label="Copy link"
          title={copied ? "Link copied!" : "Copy link to clipboard"}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full border transition-all shadow-2xs cursor-pointer shrink-0",
            copied
              ? "border-green-500/40 bg-green-500/10 text-green-500"
              : "border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)]"
          )}
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
        
        {/* 6. Bookmark / Save Issue (100% Guaranteed Visible) */}
        <button 
          onClick={handleBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Save issue"}
          title={bookmarked ? "Saved in personal vault" : "Save issue to vault"}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full border transition-all shadow-2xs cursor-pointer shrink-0",
            bookmarked 
              ? "border-amber-500/40 text-amber-500 bg-amber-500/10" 
              : "border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)]"
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>

        {/* 7. Print / PDF Clean Export */}
        <button
          onClick={() => typeof window !== 'undefined' && window.print()}
          aria-label="Export Clean PDF or Print"
          title="Export Clean PDF / Print Briefing"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ShareActions;
