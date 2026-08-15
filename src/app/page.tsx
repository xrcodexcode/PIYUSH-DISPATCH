import Link from 'next/link';
import { getLatestIssue, getAllIssues } from '@/lib/content';
import NewsletterHero from '@/components/NewsletterHero';
import LatestIssue from '@/components/LatestIssue';
import IssueCard from '@/components/IssueCard';
import SubscribeForm from '@/components/SubscribeForm';

export const dynamic = 'force-static';

export default async function HomePage() {
  const [latestIssue, allIssues] = await Promise.all([getLatestIssue(), getAllIssues()]);
  const recentIssues = allIssues.filter(i => i.id !== latestIssue?.id);

  return (
    <div className="flex flex-col gap-24 pb-24 w-full">
      {/* Hero Section */}
      <NewsletterHero />

      {/* Latest Issue */}
      {latestIssue && (
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <LatestIssue issue={latestIssue} />
        </section>
      )}



      {/* Recent Issues */}
      {recentIssues.length > 0 && (
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[var(--border-color)]">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                Archive Dispatches
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Structured briefings on AI, software architecture, and technology.
              </p>
            </div>
            <Link href="/issues" className="text-sm font-semibold text-[var(--accent)] hover:underline flex items-center gap-1">
              View all dispatches <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </section>
      )}

      {/* Subscribe Section */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <SubscribeForm variant="full" />
      </section>
    </div>
  );
}
