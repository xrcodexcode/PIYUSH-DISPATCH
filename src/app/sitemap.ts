import type { MetadataRoute } from 'next';
import { getAllIssues, getAllTopics } from '@/lib/content';
import { absoluteUrl, siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [issues, topics] = await Promise.all([getAllIssues(), getAllTopics()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    '/issues',
    '/topics',
    '/about',
    '/subscribe',
    '/search',
    '/contact',
    '/privacy',
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));

  const issueRoutes: MetadataRoute.Sitemap = issues.map((issue) => {
    const parsedDate = new Date(issue.date);
    const lastModified = isNaN(parsedDate.getTime()) ? now : parsedDate;
    return {
      url: absoluteUrl(`/issues/${issue.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    };
  });

  const topicRoutes: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: absoluteUrl(`/topics/${topic.slug}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...staticRoutes,
    ...issueRoutes,
    ...topicRoutes,
  ];
}
