'use client';

import React from 'react';
import Link from 'next/link';
import { Issue, IssueSummary } from '@/types';
import { buildIssueGraph } from '@/lib/graph';
import { formatIssueBadge, cn } from '@/lib/utils';

interface BacklinksGraphProps {
  currentIssue: Issue | IssueSummary;
  allIssues: (Issue | IssueSummary)[];
}

export function BacklinksGraph({ currentIssue, allIssues }: BacklinksGraphProps) {
  const graph = buildIssueGraph(currentIssue, allIssues);

  if (graph.connectedNodes.length === 0) return null;

  return (
    <section className="mt-14 p-6 md:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🕸️</span>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-[var(--text-primary)]">
              Knowledge Graph &amp; Backlinks
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
            Bi-directional connections &amp; cross-dispatch references across the Infinity Brain vault
          </p>
        </div>

        <span className="text-xs font-mono text-[var(--accent)] font-bold px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30">
          {graph.connectedNodes.length} Linked Nodes
        </span>
      </div>

      {/* Connected Nodes Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {graph.connectedNodes.map((node, index) => {
          const link = graph.links[index];
          const badgeText = formatIssueBadge(node.nodeType, node.issueNumber);

          return (
            <Link
              key={node.slug}
              href={`/issues/${node.slug}`}
              className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] hover:border-[var(--accent)] hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-[var(--accent)] font-bold px-2 py-0.5 rounded-md bg-[var(--accent)]/10">
                    {badgeText}
                  </span>
                  {link && (
                    <span className="text-[9px] font-mono text-[var(--text-secondary)] px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border-color)]">
                      {link.label}
                    </span>
                  )}
                </div>

                <h4 className="font-serif font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                  {node.title}
                </h4>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]/60">
                <span className="capitalize">{node.topics[0] || 'Briefing'}</span>
                <span className="text-[var(--accent)] font-bold group-hover:translate-x-0.5 transition-transform">
                  Explore Node &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default BacklinksGraph;
