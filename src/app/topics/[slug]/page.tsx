import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, siteConfig } from '@/lib/site';
import { getAllTopics, getIssuesByTopic } from '@/lib/content';
import IssueCard from '@/components/IssueCard';
import Link from 'next/link';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const topics = await getAllTopics();
  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topics = await getAllTopics();
  const topic = topics.find((t) => t.slug === slug);

  if (!topic) {
    return { title: 'Topic Not Found' };
  }

  return {
    title: `${topic.name} Dispatches`,
    description: topic.description,
    alternates: {
      canonical: `/topics/${topic.slug}`,
    },
  };
}

export default async function TopicSlugPage({ params }: Props) {
  const { slug } = await params;
  const topics = await getAllTopics();
  const topic = topics.find((t) => t.slug === slug);

  if (!topic) {
    notFound();
  }

  const issues = await getIssuesByTopic(slug);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${topic.name} Dispatches`,
    description: topic.description,
    url: absoluteUrl(`/topics/${topic.slug}`),
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    numberOfItems: issues.length,
    hasPart: issues.slice(0, 10).map((issue) => ({
      '@type': 'Article',
      headline: issue.title,
      url: absoluteUrl(`/issues/${issue.slug}`),
    })),
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-20 min-h-screen">
      <div className="mb-8">
        <Link href="/topics" className="text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center gap-1">
          <span aria-hidden="true">&larr;</span> All Topics
        </Link>
      </div>

      <header className="mb-12 border-b border-[var(--border-color)] pb-8">
        <div className="flex items-center gap-3 text-xs font-mono font-semibold text-[var(--accent)] mb-3 uppercase tracking-wider">
          <span>Topic Archive</span>
          <span>•</span>
          <span>{issues.length} {issues.length === 1 ? 'dispatch' : 'dispatches'}</span>
        </div>
        
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4 capitalize">
          {topic.name}
        </h1>
        
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
          {topic.description}
        </p>
      </header>

      {issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-[var(--text-secondary)]">
          No dispatches found for this topic yet.
        </div>
      )}
    </main>
    </>
  );
}
