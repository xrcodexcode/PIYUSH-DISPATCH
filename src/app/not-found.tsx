import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "404 - Page Not Found | PIYUSH'S DISPATCH",
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-8xl font-bold text-[var(--accent)] mb-6">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
          Page not found
        </h2>
        <p className="text-[var(--text-secondary)] mb-8">
          The page or issue you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity shadow-xs"
          >
            Return Home
          </Link>
          <Link 
            href="/issues"
            className="px-6 py-3 rounded-full border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-primary)] font-medium hover:border-[var(--accent)] transition-colors shadow-2xs"
          >
            Browse Archive
          </Link>
        </div>
      </div>
    </main>
  );
}

