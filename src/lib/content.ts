import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Issue, IssueSummary, Topic } from '@/types';
import { calculateReadingTime, extractHeadings, slugify } from './utils';

const contentDir = path.join(process.cwd(), 'content', 'issues');

// High-Performance In-Memory O(1) Indexing Engine
let cachedIssues: Issue[] | null = null;
let cachedSummaries: IssueSummary[] | null = null;
let cachedSlugMap: Map<string, Issue> | null = null;
let cachedTopics: Topic[] | null = null;
let cacheTime: number = 0;

const CACHE_TTL_MS = process.env.NODE_ENV === 'production' ? Infinity : 5000;

export async function getAllIssues(): Promise<Issue[]> {
  const now = Date.now();
  if (cachedIssues && (now - cacheTime) < CACHE_TTL_MS) {
    return cachedIssues;
  }

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir);
  const issues: Issue[] = [];
  const slugMap = new Map<string, Issue>();
  const topicMap = new Map<string, Topic>();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;

    const fullPath = path.join(contentDir, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    if (data.published === false) continue;

    const id = file.replace(/\.mdx?$/, '');
    const slug = data.slug || id;
    const issueNum = data.issueNumber || 0;

    const issueObj: Issue = {
      id,
      slug,
      issueNumber: issueNum,
      date: data.date || new Date().toISOString(),
      title: data.title || 'Untitled',
      subtitle: data.subtitle || '',
      excerpt: data.excerpt || '',
      heroImage: data.heroImage ? data.heroImage.replace(/\/issue(%23|#)/gi, '/issue-') : '',
      readingTime: calculateReadingTime(content),
      topics: data.topics || [],
      tags: data.tags || [],
      content,
      headings: extractHeadings(content),
      sources: data.sources || [],
      relatedIssues: data.relatedIssues || [],
      published: true,
      nodeType: data.nodeType || 'daily-node',
    };

    issues.push(issueObj);

    // Fast O(1) Slug & Alias Lookup Indexing
    const lowerSlug = slug.toLowerCase().trim();
    const lowerId = id.toLowerCase().trim();
    const padNum = String(issueNum).padStart(3, '0');
    const nodePrefix = issueObj.nodeType === 'deep-node' ? 'deep-nodes' : 'daily-nodes';
    const altNodePrefix = issueObj.nodeType === 'deep-node' ? 'deep-node' : 'daily-node';

    slugMap.set(lowerSlug, issueObj);
    slugMap.set(lowerId, issueObj);
    slugMap.set(`${nodePrefix}-${padNum}`.toLowerCase(), issueObj);
    slugMap.set(`${nodePrefix}-${issueNum}`.toLowerCase(), issueObj);
    slugMap.set(`the-${nodePrefix}-${padNum}`.toLowerCase(), issueObj);
    slugMap.set(`the-${nodePrefix}-${issueNum}`.toLowerCase(), issueObj);
    slugMap.set(`${altNodePrefix}-${padNum}`.toLowerCase(), issueObj);
    slugMap.set(`${altNodePrefix}-${issueNum}`.toLowerCase(), issueObj);
    slugMap.set(`the-${altNodePrefix}-${padNum}`.toLowerCase(), issueObj);
    slugMap.set(`the-${altNodePrefix}-${issueNum}`.toLowerCase(), issueObj);
  }

  // Pre-sort chronological order descending once (by date)
  issues.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Pre-compute summaries array once to avoid runtime Object.entries allocations
  const articleFields = new Set(['content', 'headings', 'sources', 'relatedIssues', 'published']);
  const summaries: IssueSummary[] = issues.map((issue) => {
    const summary = {} as IssueSummary;
    for (const key of Object.keys(issue) as (keyof Issue)[]) {
      if (!articleFields.has(key)) {
        // @ts-expect-error - intentionally narrow the surface
        summary[key] = issue[key];
      }
    }
    return summary;
  });

  // Pre-compute topic index once
  for (const issue of issues) {
    for (const topicName of issue.topics) {
      const s = slugify(topicName);
      const existing = topicMap.get(s);
      if (existing) {
        existing.count++;
      } else {
        topicMap.set(s, {
          name: topicName,
          slug: s,
          count: 1,
          description: `Articles and issues related to ${topicName}`,
        });
      }
    }
  }

  cachedIssues = issues;
  cachedSummaries = summaries;
  cachedSlugMap = slugMap;
  cachedTopics = Array.from(topicMap.values()).sort((a, b) => b.count - a.count);
  cacheTime = now;

  return issues;
}

export async function getIssueSummaries(): Promise<IssueSummary[]> {
  await getAllIssues();
  return cachedSummaries || [];
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  await getAllIssues();
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  if (cleanSlug === 'latest' && cachedIssues && cachedIssues.length > 0) {
    return cachedIssues[0];
  }
  return cachedSlugMap?.get(cleanSlug) || null;
}

export async function getIssuesByTopic(topicSlug: string): Promise<Issue[]> {
  const issues = await getAllIssues();
  return issues.filter((issue) =>
    issue.topics.some(topic => slugify(topic) === topicSlug)
  );
}

export async function getAllTopics(): Promise<Topic[]> {
  await getAllIssues();
  return cachedTopics || [];
}

export async function getRelatedIssues(issue: Issue, limit: number = 3): Promise<Issue[]> {
  const issues = await getAllIssues();

  // The next issue chronologically should come FIRST in Continue Reading
  const nextIssue = (await getNextIssue(issue.issueNumber)) || issues.find(i => i.issueNumber === 1) || null;

  const candidates = issues.filter(i => i.slug !== issue.slug && (!nextIssue || i.slug !== nextIssue.slug));

  const sortedByTopic = candidates
    .map(i => {
      const commonTopics = i.topics.filter(t => issue.topics.includes(t)).length;
      return { issue: i, score: commonTopics };
    })
    .sort((a, b) => b.score - a.score)
    .map(i => i.issue);

  const result: Issue[] = [];
  if (nextIssue && nextIssue.slug !== issue.slug) {
    result.push(nextIssue);
  }

  for (const item of sortedByTopic) {
    if (result.length >= limit) break;
    if (!result.some(r => r.slug === item.slug)) {
      result.push(item);
    }
  }

  return result.slice(0, limit);
}

export async function getPreviousIssue(issueNumber: number, nodeType?: string): Promise<Issue | null> {
  const issues = await getAllIssues();
  if (nodeType) {
    const typeIssues = issues.filter(i => (i.nodeType || 'daily-node') === nodeType);
    const match = typeIssues.find(i => i.issueNumber < issueNumber);
    if (match) return match;
  }
  return issues.find(i => i.issueNumber < issueNumber) || null;
}

export async function getNextIssue(issueNumber: number, nodeType?: string): Promise<Issue | null> {
  const issues = await getAllIssues();
  if (nodeType) {
    const typeIssues = issues.filter(i => (i.nodeType || 'daily-node') === nodeType);
    const match = [...typeIssues].reverse().find(i => i.issueNumber > issueNumber);
    if (match) return match;
  }
  return [...issues].reverse().find(i => i.issueNumber > issueNumber) || null;
}

export async function searchIssues(query: string): Promise<Issue[]> {
  if (!query || query.trim() === '') return [];

  const issues = await getAllIssues();
  const q = query.toLowerCase().trim().slice(0, 100);

  return issues.filter(issue => {
    const badgeText = `the daily nodes #${String(issue.issueNumber).padStart(3, '0')}`.toLowerCase();
    const rawBadgeText = `daily-nodes#${String(issue.issueNumber).padStart(3, '0')}`.toLowerCase();
    const nodeTypeText = (issue.nodeType || 'daily-node').toLowerCase();
    const nodeTypeDisplay = nodeTypeText === 'deep-node' ? 'deep node' : 'daily node';
    const altNodeText = `node-${issue.issueNumber}`.toLowerCase();
    const altNodeSpaceText = `node ${issue.issueNumber}`.toLowerCase();

    return (
      issue.title.toLowerCase().includes(q) ||
      issue.subtitle.toLowerCase().includes(q) ||
      issue.excerpt.toLowerCase().includes(q) ||
      issue.content.toLowerCase().includes(q) ||
      issue.topics.some(t => t.toLowerCase().includes(q)) ||
      issue.tags.some(t => t.toLowerCase().includes(q)) ||
      nodeTypeText.includes(q) ||
      nodeTypeDisplay.includes(q) ||
      badgeText.includes(q) ||
      rawBadgeText.includes(q) ||
      altNodeText.includes(q) ||
      altNodeSpaceText.includes(q)
    );
  });
}

export async function getLatestIssue(): Promise<Issue | null> {
  const issues = await getAllIssues();
  return issues.length > 0 ? issues[0] : null;
}
