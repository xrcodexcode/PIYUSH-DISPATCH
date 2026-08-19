import { getAllIssues } from '@/lib/content';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

function escapeXml(value: unknown): string {
  if (!value || typeof value !== 'string') return '';
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function safeToUTCString(dateStr: string | undefined): string {
  if (!dateStr) return new Date().toUTCString();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

export async function GET() {
  const issues = await getAllIssues();
  const updatedAt = issues[0]?.date ?? new Date().toISOString();

  const items = issues
    .map((issue) => {
      const url = absoluteUrl(`/issues/${issue.slug}`);
      const categories = [...issue.topics, ...issue.tags]
        .map((category) => `<category>${escapeXml(category)}</category>`)
        .join('');

      return `
        <item>
          <title>${escapeXml(issue.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${safeToUTCString(issue.date)}</pubDate>
          <author>${escapeXml(siteConfig.contactEmail)} (${escapeXml(siteConfig.author.name)})</author>
          <description>${escapeXml(issue.excerpt || issue.subtitle)}</description>
          ${categories}
        </item>`;
    })
    .join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(siteConfig.name)}</title>
        <link>${siteConfig.url}</link>
        <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
        <description>${escapeXml(siteConfig.description)}</description>
        <language>en-US</language>
        <lastBuildDate>${new Date(updatedAt).toUTCString()}</lastBuildDate>
        <managingEditor>${escapeXml(siteConfig.contactEmail)} (${escapeXml(siteConfig.author.name)})</managingEditor>
        <webMaster>${escapeXml(siteConfig.contactEmail)} (${escapeXml(siteConfig.author.name)})</webMaster>
        ${items}
      </channel>
    </rss>`;

  return new Response(feed.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

