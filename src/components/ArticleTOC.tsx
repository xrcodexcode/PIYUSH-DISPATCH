'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ArticleTOCProps {
  headings: Heading[];
}

export function ArticleTOC({ headings }: ArticleTOCProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Controls state: isPinned (always visible) vs auto-hide physics
  const [isPinned, setIsPinned] = useState(false);
  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const lastScrollY = useRef(0);

  // Active Heading Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0% -70% 0%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  // Scroll Autohide Physics (active when NOT pinned)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isPinned) return; // Never hide when pinned

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY > 200 && currentScrollY > lastScrollY.current + 8) {
            setIsScrollHidden(true);
          } else if (currentScrollY < lastScrollY.current - 12 || currentScrollY < 150) {
            setIsScrollHidden(false);
          }
          
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPinned]);

  const handleTogglePin = () => {
    const nextPinned = !isPinned;
    setIsPinned(nextPinned);
    if (!nextPinned) {
      // Unpinning automatically hides if scrolled past top header
      if (window.scrollY > 200) {
        setIsScrollHidden(true);
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMobileOpen(false);
  };

  if (headings.length === 0) return null;

  // Determine visibility based on physics: pinned, hovered, or scroll position
  const isVisible = isPinned || isHovered || !isScrollHidden;

  return (
    <div className="w-full relative">
      {/* Hover Trigger Zone along the left margin */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        className="hidden lg:block fixed left-0 top-24 bottom-0 w-24 z-30 pointer-events-auto"
      />

      {/* Floating Index Trigger Pill (Visible when Index is auto-hidden) */}
      {!isVisible && (
        <button
          onClick={() => {
            setIsScrollHidden(false);
            setIsHovered(true);
          }}
          onMouseEnter={() => setIsHovered(true)}
          className="hidden lg:flex fixed left-6 top-32 z-40 items-center gap-2 px-3.5 py-2 rounded-full border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-md text-xs font-mono font-bold backdrop-blur-md"
          title="Show Table of Contents"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span>INDEX</span>
        </button>
      )}

      {/* Mobile View - Collapsible Accordion */}
      <div className="lg:hidden mb-8 border border-[var(--border-color)] rounded-2xl overflow-hidden bg-[var(--surface)] shadow-xs">
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full px-4 py-3 flex justify-between items-center text-xs font-semibold text-[var(--text-primary)]"
        >
          <span className="font-mono uppercase tracking-wider text-[var(--accent)]">Table of Contents</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("transition-transform duration-200", isMobileOpen && "rotate-180")}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {isMobileOpen && (
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg)]">
            <ul className="space-y-2 text-xs">
              {headings.map((heading) => (
                <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}>
                  <a 
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={cn(
                      "block transition-colors py-1",
                      activeId === heading.id 
                        ? "text-[var(--accent)] font-semibold" 
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Desktop View - Sticky Table of Contents with Pin Control */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "hidden lg:block transition-all duration-300 transform",
          isVisible 
            ? "opacity-100 translate-x-0 pointer-events-auto" 
            : "opacity-0 -translate-x-8 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono font-bold text-xs tracking-wider uppercase text-[var(--accent)] flex items-center gap-2">
            <span>INDEX</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          </h3>

          {/* Pin Toggle Button */}
          <button
            onClick={handleTogglePin}
            title={isPinned ? "Unpin Table of Contents (Enable Autohide)" : "Pin Table of Contents (Keep Always Visible)"}
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-mono transition-all border flex items-center gap-1 cursor-pointer",
              isPinned 
                ? "bg-[var(--accent)] text-white border-[var(--accent)] font-bold shadow-xs" 
                : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="17" x2="12" y2="22"/>
              <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
            </svg>
            <span>{isPinned ? 'Pinned' : 'Pin'}</span>
          </button>
        </div>

        <ul className="space-y-2.5 text-xs border-l-2 border-[var(--border-color)] max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
          {headings.map((heading) => (
            <li key={heading.id} className="relative">
              <a 
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={cn(
                  "block pl-4 py-1 transition-colors leading-relaxed",
                  activeId === heading.id 
                    ? "text-[var(--accent)] font-bold text-sm" 
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
                style={{ paddingLeft: `${(heading.level - 2) * 0.75 + 1}rem` }}
              >
                {activeId === heading.id && (
                  <span className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-[2px] h-full bg-[var(--accent)] rounded-r" />
                )}
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ArticleTOC;
