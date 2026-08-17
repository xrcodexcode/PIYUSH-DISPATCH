'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getGlossaryTerm } from '@/lib/glossary';

interface GlossaryTooltipProps {
  termKey: string;
  children: React.ReactNode;
}

export function GlossaryTooltip({ termKey, children }: GlossaryTooltipProps) {
  const termData = getGlossaryTerm(termKey);
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!termData) {
    return <>{children}</>;
  }

  return (
    <span
      ref={tooltipRef}
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-0.5 border-b border-dashed border-[var(--accent)] text-[var(--text-primary)] font-medium hover:text-[var(--accent)] transition-colors cursor-help"
        aria-label={`Definition for ${termData.term}`}
      >
        <span>{children}</span>
        <span className="text-[10px] text-[var(--accent)] font-mono font-bold leading-none">?</span>
      </button>

      {isOpen && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] shadow-2xl z-50 text-left backdrop-blur-md animate-fadeIn block text-[var(--text-primary)]">
          <span className="flex items-center justify-between gap-2 mb-2 border-b border-[var(--border-color)] pb-2 block">
            <span className="font-mono text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider block">
              {termData.term}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--bg)] text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--border-color)] block">
              {termData.category}
            </span>
          </span>

          <span className="text-xs text-[var(--text-primary)] leading-relaxed mb-2 block font-normal">
            {termData.shortDefinition}
          </span>

          <span className="text-[11px] text-[var(--text-secondary)] leading-normal block mb-3 font-light italic">
            {termData.extendedExplanation}
          </span>

          <span className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between block">
            <Link
              href={`/topics/${termData.relatedTopic}`}
              className="text-[10px] font-mono font-bold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              <span>Explore {termData.relatedTopic}</span>
              <span>&rarr;</span>
            </Link>
            <span className="text-[9px] font-mono text-[var(--text-secondary)]">
              node-wiki Glossary
            </span>
          </span>
        </span>
      )}
    </span>
  );
}

export default GlossaryTooltip;
