import type { Metadata } from 'next';
import { getIssueSummaries } from '@/lib/content';
import SearchInterface from '@/components/SearchInterface';

export const metadata: Metadata = {
  title: 'Search Vault',
  description: "Search across all newsletter dispatches, articles, and concepts.",
  alternates: {
    canonical: '/search',
  },
};

export const dynamic = 'force-static';

export default async function SearchPage() {
  const issues = await getIssueSummaries();

  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-20 min-h-[75vh]">
      <header className="mb-12 border-b border-[var(--border-color)] pb-8">
        <div className="inline-block mb-3 px-3 py-1 border border-[var(--border-color)] bg-[var(--surface)] rounded-full text-xs font-mono text-[var(--accent)] uppercase font-semibold">
          Instant Discovery
        </div>
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
          Search Vault
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
          Search specific topics, concepts, models, or frameworks across our complete knowledge base.
        </p>
      </header>

      <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-6 md:p-12 shadow-xs">
        <SearchInterface initialIssues={issues} />
      </div>
    </main>
  );
}
