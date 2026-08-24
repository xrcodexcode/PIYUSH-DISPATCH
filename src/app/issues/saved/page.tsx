import React from 'react';
import { Metadata } from 'next';
import { getAllIssues } from '@/lib/content';
import SavedIssuesClient from './SavedIssuesClient';

export const metadata: Metadata = {
  title: "Saved Vault | Piyush's Dispatch",
  description: "Access your bookmarked dispatches and technical briefing notes.",
  robots: { index: false, follow: true },
  alternates: { canonical: '/issues/saved' },
};

export default async function SavedVaultPage() {
  const allIssues = await getAllIssues();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
      <header className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border-color)] text-xs font-mono text-[var(--accent)] font-semibold">
          <span>🔖 Personal Vault</span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Saved Dispatches
        </h1>
        <p className="text-base text-[var(--text-secondary)]">
          Your bookmarked engineering briefings, system architecture notes, and AI deep dives.
        </p>
      </header>

      <SavedIssuesClient allIssues={allIssues} />
    </div>
  );
}
