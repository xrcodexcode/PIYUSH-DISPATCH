import React from 'react';
import Link from 'next/link';
import { IssueSummary } from '@/types';
import { formatDate, formatIssueBadge, cn } from '@/lib/utils';
import BookmarkButton from './BookmarkButton';
import OptimizedImage from './OptimizedImage';

interface IssueCardProps {
  issue: IssueSummary;
  variant?: 'default' | 'compact';
}

export function IssueCard({ issue, variant = 'default' }: IssueCardProps) {
  const isCompact = variant === 'compact';
  const issueBadgeText = formatIssueBadge(issue.nodeType, issue.issueNumber);

  return (
    <article className={cn(
      "group relative bg-[var(--surface)] transition-all duration-300 border border-[var(--border-color)] rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-[var(--accent)]",
      isCompact ? "p-4 md:p-5" : "p-5 md:p-6"
    )}>
      <div>
        {/* Cover Image Container (Clean 100% Pristine Image with Zero Badge Overlap) */}
        {issue.heroImage && (
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-[var(--bg)] border border-[var(--border-color)]">
            <OptimizedImage
              src={issue.heroImage}
              alt={issue.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              fallback={
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--surface)] to-[var(--bg)] flex items-center justify-center p-4 text-center">
                  <span className="font-mono text-xs text-[var(--accent)] font-bold">{issueBadgeText}</span>
                </div>
              }
            />

            {/* Save Bookmark Overlay */}
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-[var(--bg)]/90 backdrop-blur-md rounded-full p-1 border border-[var(--border-color)] shadow-xs">
                <BookmarkButton slug={issue.slug} compact />
              </div>
            </div>
          </div>
        )}

        {/* Issue Metadata & Badge Line (Zero Overlap on Image) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-mono text-[var(--text-secondary)]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)]">
              {issueBadgeText}
            </span>
            <time dateTime={issue.date}>{formatDate(issue.date)}</time>
          </div>
          {issue.readingTime > 0 && (
            <span>{issue.readingTime} min read</span>
          )}
        </div>
        
        {/* Title */}
        <Link href={`/issues/${issue.slug}`} className="relative z-10 block group-hover:text-[var(--accent)] transition-colors">
          <h3 className={cn(
            "font-serif font-bold text-[var(--text-primary)] leading-tight mb-2.5",
            isCompact ? "text-lg" : "text-xl md:text-2xl"
          )}>
            {issue.title}
          </h3>
        </Link>

        {/* Subtitle */}
        {issue.subtitle && (
          <p className="text-xs md:text-sm font-medium text-[var(--text-secondary)] mb-3 line-clamp-1 italic">
            {issue.subtitle}
          </p>
        )}

        {/* Excerpt */}
        <p className="text-xs md:text-sm text-[var(--text-secondary)] mb-5 leading-relaxed line-clamp-2">
          {issue.excerpt}
        </p>

        {/* Topic Tags */}
        {issue.topics && issue.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
            {issue.topics.slice(0, 3).map((topic, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--border-color)] text-[var(--text-secondary)] uppercase tracking-wider">
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer Link */}
      <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between mt-auto relative z-10">
        <Link 
          href={`/issues/${issue.slug}`}
          className="text-xs font-mono font-bold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
        >
          <span>Read Dispatch</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">
          {issue.nodeType === 'deep-node' ? 'Deep Node' : 'Daily Node'}
        </span>
      </div>
    </article>
  );
}

export default IssueCard;
