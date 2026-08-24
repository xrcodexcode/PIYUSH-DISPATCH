import type { MetadataRoute } from 'next';
import { getAllIssues, getAllTopics } from '@/lib/content';
import { absoluteUrl, siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [issues, topics] = await Promise.all([getAllIssues(), getAllTopics()]);
  const now = new Date();

  const staticRouteConfigs: Array<{ route: string; frequency: 'daily' | 'weekly' | 'monthly'; prio: number }> = [
    { route: '/issues', frequency: 'daily', prio: 0.9 },
    { route: '/topics', frequency: 'weekly', prio: 0.7 },
    { route: '/about', frequency: 'monthly', prio: 0.5 },
    { route: '/subscribe', frequency: 'monthly', prio: 0.6 },
    { route: '/contact', frequency: 'monthly', prio: 0.4 },
    { route: '/privacy', frequency: 'monthly', prio: 0.3 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticRouteConfigs.map(({ route, frequency, prio }) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: frequency,
    priority: prio,
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
