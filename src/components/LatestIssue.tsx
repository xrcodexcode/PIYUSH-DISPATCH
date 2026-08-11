import React from 'react';
import Link from 'next/link';
import { Issue } from '@/types';
import { formatDate, formatIssueBadge } from '@/lib/utils';
import OptimizedImage from './OptimizedImage';

interface LatestIssueProps {
  issue: Issue;
}

export function LatestIssue({ issue }: LatestIssueProps) {
  const shouldShowExcerpt = issue.excerpt && issue.excerpt.trim() !== issue.subtitle.trim();

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-mono font-bold text-xs tracking-widest uppercase text-[var(--accent)]">Today&apos;s Issue</h2>
        <div className="flex-1 h-[1px] bg-[var(--border-color)]"></div>
      </div>

      <div className="group relative border border-[var(--border-color)] rounded-3xl overflow-hidden bg-[var(--surface)] transition-all hover:shadow-xl flex flex-col lg:flex-row">
        
        {/* Content Side */}
        <div className="p-8 md:p-14 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-secondary)] mb-6">
            <span className="font-semibold bg-[var(--bg)] px-3 py-1 rounded-full border border-[var(--border-color)] text-[var(--accent)]">
              {formatIssueBadge(issue.nodeType, issue.issueNumber)}
            </span>
            <span>•</span>
            <time dateTime={issue.date}>{formatDate(issue.date)}</time>
          </div>

          <Link href={`/issues/${issue.slug}`} className="block group-hover:text-[var(--accent)] transition-colors">
            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-[1.15]">
              {issue.title}
            </h3>
          </Link>

          {issue.subtitle && (
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-6 font-light leading-relaxed">
              {issue.subtitle}
            </p>
          )}

          {shouldShowExcerpt && (
            <p className="text-base md:text-lg text-[var(--text-secondary)] mb-8 line-clamp-3 leading-relaxed opacity-90">
              {issue.excerpt}
            </p>
          )}

          <div className="mt-auto pt-6 flex items-center justify-between border-t border-[var(--border-color)]">
            <span className="text-xs font-mono text-[var(--text-secondary)] flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {issue.readingTime} min read
            </span>
            <Link 
              href={`/issues/${issue.slug}`} 
              className="bg-[var(--accent)] text-white px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-xs"
            >
              Read today&apos;s dispatch <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Image Side */}
        <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] relative min-h-[320px] lg:min-h-[480px] bg-[var(--bg)] overflow-hidden flex items-center justify-center">
          {issue.heroImage ? (
            <OptimizedImage
              src={issue.heroImage} 
              alt={issue.title} 
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              fallback={
                <div className="w-full h-full p-12 flex flex-col justify-between bg-gradient-to-br from-[var(--surface)] to-[var(--bg)]">
                  <div className="text-xs font-mono tracking-widest text-[var(--accent)] uppercase font-semibold">Flagship Briefing</div>
                  <div className="font-serif font-bold text-3xl md:text-4xl text-[var(--text-primary)] leading-tight opacity-80">&quot;{issue.title}&quot;</div>
                  <div className="text-xs font-mono text-[var(--text-secondary)]">Piyush&apos;s Dispatch</div>
                </div>
              }
            />
          ) : (
            <div className="w-full h-full p-12 flex flex-col justify-between bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] relative overflow-hidden">
              <div className="text-xs font-mono tracking-widest text-[var(--accent)] uppercase font-semibold">Flagship Briefing</div>
              <div className="font-serif font-bold text-3xl md:text-4xl text-[var(--text-primary)] leading-tight opacity-80">
                &quot;{issue.title}&quot;
              </div>
              <div className="flex justify-between items-center text-xs font-mono text-[var(--text-secondary)]">
                <span>Piyush&apos;s Dispatch</span>
                <span>{formatIssueBadge(issue.nodeType, issue.issueNumber)}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default LatestIssue;
