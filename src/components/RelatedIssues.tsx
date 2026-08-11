import React from 'react';
import Link from 'next/link';
import { Issue } from '@/types';
import { formatIssueBadge } from '@/lib/utils';

interface RelatedIssuesProps {
  issues: Issue[];
}

export function RelatedIssues({ issues }: RelatedIssuesProps) {
  if (!issues || issues.length === 0) return null;

  return (
    <section className="mt-20 pt-16 border-t border-[var(--border-color)]">
      <div className="w-full">
        <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">
          Continue Reading
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {issues.slice(0, 3).map((issue) => (
            <Link 
              key={issue.id} 
              href={`/issues/${issue.slug}`}
              className="group flex flex-col bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 hover:shadow-lg hover:border-[var(--accent)] transition-all duration-300"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-3">
                <span className="text-[var(--accent)] font-semibold">
                  {formatIssueBadge(issue.nodeType, issue.issueNumber)}
                </span>
                {issue.readingTime > 0 && (
                  <span>{issue.readingTime} min read</span>
                )}
              </div>
              
              <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                {issue.title}
              </h3>
              
              <p className="text-sm text-[var(--text-secondary)] line-clamp-3 flex-grow leading-relaxed">
                {issue.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedIssues;
