import { Heading } from '@/types';

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const noOfWords = content.trim().split(/\s+/).length;
  const minutes = noOfWords / wordsPerMinute;
  return Math.max(1, Math.ceil(minutes));
}

export function slugify(text: string): string {
  const clean = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean || 'section';
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatIssueBadge(nodeType: string | undefined, issueNumber: number): string {
  const seriesName = nodeType === 'deep-node' ? 'The Deep Node' : 'The Daily Nodes';
  return `${seriesName} #${String(issueNumber).padStart(3, '0')}`;
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const seenIds = new Map<string, number>();
  const lines = content.split('\n');
  
  const codeBlockRegex = /^```/;
  let inCodeBlock = false;

  for (const line of lines) {
    if (codeBlockRegex.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_~`]/g, '').trim();
      const baseId = slugify(text);
      const count = seenIds.get(baseId) || 0;
      const id = count === 0 ? baseId : `${baseId}-${count}`;
      seenIds.set(baseId, count + 1);

      headings.push({ id, text, level });
    }
  }

  return headings;
}


export function generateExcerpt(content: string, maxLength: number = 150): string {
  // Remove markdown formatting
  const text = content
    .replace(/#+\s+.+/g, '') // Remove headings
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
    .replace(/[*_~`]/g, '') // Remove bold, italic, code
    .replace(/>\s+/g, '') // Remove blockquotes
    .replace(/---/g, '') // Remove horizontal rules
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();

  if (text.length <= maxLength) return text;
  
  // Cut at maxLength and find last space to not cut mid-word
  const cut = text.substring(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.substring(0, lastSpace) : cut) + '...';
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}
