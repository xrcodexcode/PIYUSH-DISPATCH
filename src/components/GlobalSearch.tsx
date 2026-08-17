import React from 'react';
import { getAllIssues } from '@/lib/content';
import { CommandSearchClient } from './CommandSearchClient';

export async function GlobalSearch() {
  const issues = await getAllIssues();
  // Strip out full content to save payload size
  const summaries = issues.map(issue => ({
    id: issue.id,
    slug: issue.slug,
    title: issue.title,
    subtitle: issue.subtitle,
    excerpt: issue.excerpt,
    date: issue.date,
    topics: issue.topics,
    tags: issue.tags,
    issueNumber: issue.issueNumber,
    nodeType: issue.nodeType,
  }));

  return <CommandSearchClient issues={summaries as any} />;
}
