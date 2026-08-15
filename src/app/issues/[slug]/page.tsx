import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllIssues,
  getIssueBySlug,
  getRelatedIssues,
  getPreviousIssue,
  getNextIssue
} from '@/lib/content';
import { formatDate, formatIssueBadge, slugify } from '@/lib/utils';
import ArticleTOC from '@/components/ArticleTOC';
import ShareActions from '@/components/ShareActions';
import SourceList from '@/components/SourceList';
import RelatedIssues from '@/components/RelatedIssues';
import PrevNextNav from '@/components/PrevNextNav';
import SubscribeForm from '@/components/SubscribeForm';
import MDXContent from '@/components/MDXContent';
import OptimizedImage from '@/components/OptimizedImage';
import JsonLd from '@/components/JsonLd';
import BookmarkButton from '@/components/BookmarkButton';
import { absoluteUrl, siteConfig } from '@/lib/site';

import AudioPlayer from '@/components/AudioPlayer';
import DispatchFeedback from '@/components/DispatchFeedback';
import SubscribeDrawer from '@/components/SubscribeDrawer';
import ZenReadingControls from '@/components/ZenReadingControls';
import BackToTop from '@/components/BackToTop';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const issues = await getAllIssues();
  return issues.map((issue) => ({
    slug: issue.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);

  if (!issue) {
    return { title: 'Issue Not Found' };
  }

  return {
    title: issue.title,
    description: issue.excerpt,
    alternates: {
      canonical: `/issues/${issue.slug}`,
    },
    openGraph: {
      title: issue.title,
      description: issue.excerpt,
      url: absoluteUrl(`/issues/${issue.slug}`),
      type: 'article',
      publishedTime: issue.date,
      authors: [siteConfig.author.name],
      tags: [...issue.topics, ...issue.tags],
      images: issue.heroImage ? [issue.heroImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: issue.title,
      description: issue.excerpt,
      images: issue.heroImage ? [issue.heroImage] : [siteConfig.defaultImage],
    },
  };
}

export default async function IssuePage({ params }: Props) {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  const [related, prev, next] = await Promise.all([
    getRelatedIssues(issue, 3),
    getPreviousIssue(issue.issueNumber),
    getNextIssue(issue.issueNumber),
  ]);
  const articleUrl = absoluteUrl(`/issues/${issue.slug}`);
  const articleImage = issue.heroImage ? absoluteUrl(issue.heroImage) : absoluteUrl(siteConfig.defaultImage);


  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: issue.title,
    description: issue.excerpt,
    image: [articleImage],
    datePublished: issue.date,
    dateModified: issue.date,
    mainEntityOfPage: articleUrl,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
      sameAs: siteConfig.author.sameAs,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      sameAs: siteConfig.author.sameAs,
    },
    articleSection: issue.topics,
    keywords: [...issue.topics, ...issue.tags].join(', '),
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Dispatches',
        item: absoluteUrl('/issues'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: issue.title,
        item: articleUrl,
      },
    ],
  };

  const substackSource = issue.sources?.find(s => s.url && s.url.includes('substack.com'));
  const rawSubstackUrl = substackSource ? substackSource.url : 'https://xrcodex.substack.com';
  const substackPostUrl = rawSubstackUrl.startsWith('https://') ? rawSubstackUrl : 'https://xrcodex.substack.com';


  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbsJsonLd} />
      
      <article className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] pt-8 pb-24 transition-colors">
        {/* Article Top Controls Bar */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex justify-between items-center mb-8 non-reading-ui">
          <Link href="/issues" className="text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center gap-1">
            <span aria-hidden="true">&larr;</span> Back to Archive
          </Link>
          <div className="flex items-center gap-3">
            <BookmarkButton slug={issue.slug} />
            <ZenReadingControls />
          </div>
        </div>

        {/* Article Header */}
        <header className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 text-center mb-12">
          <div className="flex items-center justify-center gap-3 text-xs font-mono font-semibold text-[var(--accent)] mb-6 tracking-wider uppercase">
            <span>{formatIssueBadge(issue.nodeType, issue.issueNumber)}</span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>{issue.readingTime} min read</span>
            {issue.nodeType && (
              <>
                <span className="w-1 h-1 rounded-full bg-current" />
                <span className="capitalize">{issue.nodeType.replace('-', ' ')}</span>
              </>
            )}
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] max-w-4xl mx-auto leading-[1.1] mb-6 tracking-tight">
            {issue.title}
          </h1>
          
          {issue.subtitle && (
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto font-sans font-normal leading-relaxed">
              {issue.subtitle}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--text-secondary)]">
            <span>By <Link href="/about" className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]">{siteConfig.author.name}</Link></span>
            <span aria-hidden="true">•</span>
            <span>Updated <time dateTime={issue.date}>{formatDate(issue.date)}</time></span>
            <span aria-hidden="true">•</span>
            <a href="#sources" className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]">Sources</a>
          </div>
        </header>

        {/* Hero Visual */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 mb-12 hero-image-wrapper">
          {issue.heroImage ? (
            <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-[var(--border-color)] aspect-[21/9] bg-[var(--surface)]">
              <OptimizedImage
                src={issue.heroImage} 
                alt={issue.title}
                fill
                sizes="(max-width: 1024px) 100vw, 960px"
                priority
                className="object-cover bg-[var(--surface)]"
                fallback={<div className="absolute inset-0 bg-gradient-to-tr from-[var(--surface)] to-[var(--bg)]" />}
              />
            </div>
          ) : (
            <div className="max-w-5xl mx-auto rounded-3xl aspect-[21/9] bg-gradient-to-tr from-[var(--surface)] to-[var(--bg)] border border-[var(--border-color)] flex items-center justify-center p-8 text-center" />
          )}
        </div>

        {/* Perfectly Centered Main Reading Layout */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative justify-between items-start">
          
          {/* Left Sidebar - Permanently Sticky Table of Contents & Share Actions */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0 order-1 sticky top-24 h-fit self-start space-y-6 non-reading-ui z-40">
            <ArticleTOC headings={issue.headings} />
            <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] shadow-xs">
              <ShareActions title={issue.title} substackUrl={substackPostUrl} />
            </div>
          </aside>

          {/* Core Reading Column (Mathematically Centered) */}
          <div className="flex-1 max-w-[760px] mx-auto order-1 lg:order-2 w-full">
            {/* Audio Player Bar */}
            <div className="mb-10 non-reading-ui">
              <AudioPlayer title={issue.title} textToRead={issue.content} readingTimeMinutes={issue.readingTime} />
            </div>

            {/* Mobile Table of Contents & Share */}
            <div className="lg:hidden mb-8 space-y-6 non-reading-ui">
              <ArticleTOC headings={issue.headings} />
              <ShareActions title={issue.title} substackUrl={substackPostUrl} />
            </div>

            <div className="prose prose-lg max-w-none">
              <MDXContent content={issue.content} />
            </div>

            {/* Interactive Feedback & Rating Widget */}
            <div className="mt-14 non-reading-ui">
              <DispatchFeedback slug={issue.slug} />
            </div>

            {/* End of Article Share Bar */}
            <div className="mt-12 pt-8 border-t border-[var(--border-color)] non-reading-ui">
              <div className="p-6 md:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] text-center shadow-xs">
                <h3 className="font-serif font-bold text-xl md:text-2xl text-[var(--text-primary)] mb-2">
                  Share this dispatch
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                  Help spread high-signal engineering and AI analysis across your network.
                </p>
                <ShareActions title={issue.title} substackUrl={substackPostUrl} className="items-center justify-center" />
              </div>
            </div>

            {/* Sources & Substack Original Provenance */}
            <div id="sources" className="mt-12 pt-8 border-t border-[var(--border-color)] scroll-mt-28">
              <SourceList sources={issue.sources || []} />
            </div>
          </div>

          {/* Right Balancing Column (Equal width lg:w-72 for 100% perfect center alignment) */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0 order-3 pointer-events-none aria-hidden non-reading-ui" />

        </div>

        {/* Footer Navigation & Recommendation Content */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 mt-24 non-reading-ui">
          <div className="max-w-[760px] mx-auto">
            <hr className="border-[var(--border-color)] mb-12" />
            
            <PrevNextNav previousIssue={prev} nextIssue={next} />
            
            {related.length > 0 && (
              <div className="mt-20">
                <RelatedIssues issues={related} />
              </div>
            )}

            <div className="mt-20 text-center">
              <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3 text-[var(--text-primary)]">
                Enjoyed this briefing?
              </h3>
              <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                Subscribe to get daily insights delivered directly to your inbox. No noise, just high signal.
              </p>
              <SubscribeForm variant="inline" />
            </div>
          </div>
        </div>
      </article>

      <SubscribeDrawer />
      <BackToTop />
    </>
  );
}
