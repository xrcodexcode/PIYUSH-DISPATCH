'use client';

import React from 'react';
import Link from 'next/link';
import { getSeriesForIssue } from '@/lib/series';
import { cn } from '@/lib/utils';

interface SeriesTrackCardProps {
  issueSlug: string;
}

export function SeriesTrackCard({ issueSlug }: SeriesTrackCardProps) {
  const seriesInfo = getSeriesForIssue(issueSlug);
  if (!seriesInfo) return null;

  const { series, currentIndex, nextSlug } = seriesInfo;

  return (
    <div className="my-10 p-6 md:p-8 rounded-3xl border border-[var(--accent)]/30 bg-[var(--surface)] text-[var(--text-primary)] shadow-xs relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[var(--accent)] text-white text-[11px] font-mono font-bold tracking-wider uppercase shadow-2xs">
            {series.badge}
          </span>
        </div>

        {nextSlug && (
          <Link
            href={`/issues/${nextSlug}`}
            className="text-xs font-mono font-bold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
          >
            <span>Next in Series</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>

      <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-2">
        {series.title}
      </h3>
      
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl leading-relaxed">
        {series.description}
      </p>

      {/* Progress Steps Visualizer */}
      <div 
        className="grid gap-2.5 pt-2 border-t border-[var(--border-color)]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}
      >
        {series.issueSlugs.map((slug, idx) => {
          const isCurrent = idx === currentIndex;
          const isPast = idx < currentIndex;

          return (
            <Link
              key={slug}
              href={`/issues/${slug}`}
              className={cn(
                "p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between gap-1.5",
                isCurrent
                  ? "border-[var(--accent)] bg-[var(--bg)] shadow-xs"
                  : isPast
                  ? "border-[var(--border-color)] bg-[var(--bg)]/50 opacity-80 hover:opacity-100 hover:border-[var(--accent)]"
                  : "border-[var(--border-color)] bg-[var(--bg)]/30 text-[var(--text-secondary)] hover:border-[var(--accent)]"
              )}
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className={isCurrent ? "font-bold text-[var(--accent)]" : "text-[var(--text-secondary)]"}>
                  Part 0{idx + 1}
                </span>
                {isPast ? (
                  <span className="text-green-500 font-bold">✓</span>
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                ) : null}
              </div>
              <span className={cn("font-medium line-clamp-1 capitalize", isCurrent && "font-bold text-[var(--text-primary)]")}>
                {slug.replace(/^\d+-/, '').replace(/-/g, ' ')}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SeriesTrackCard;
