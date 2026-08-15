import React from 'react';
import { isSafeUrl, sanitizeUrl } from '@/lib/security';

interface Source {
  title: string;
  publisher: string;
  date: string;
  url: string;
}

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  const substackSource = sources?.find(s => s.url && s.url.includes('substack.com'));
  const substackUrl = substackSource && isSafeUrl(substackSource.url) 
    ? substackSource.url 
    : "https://xrcodex.substack.com";

  // Ensure node-wiki is present
  const hasNodeWiki = sources?.some(s => s.title.toLowerCase().includes('node-wiki'));
  const displaySources = [...(sources || [])];
  if (!hasNodeWiki) {
    displaySources.push({
      title: "node-wiki (My Knowledge Base)",
      publisher: "Infinity Brain Vault",
      date: "Permanent Atomic Note",
      url: "/about"
    });
  }

  return (
    <section id="sources" className="mt-16 pt-8 border-t border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="font-serif font-bold text-xl text-[var(--text-primary)] flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
          <span>Sources & Provenance</span>
        </h3>

        <a 
          href={substackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-mono font-bold hover:bg-orange-500/20 transition-all shadow-2xs"
        >
          <span>🍊</span>
          <span>Read Original on Substack</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>

      <ol className="list-decimal list-outside ml-5 space-y-4 text-sm text-[var(--text-secondary)]">
        {displaySources.map((source, index) => {
          const isSubstack = source.url && source.url.includes('substack.com');
          const isNodeWiki = source.title.toLowerCase().includes('node-wiki');
          const safeUrl = sanitizeUrl(source.url, '/');

          return (
            <li key={index} className="pl-2">
              <a 
                href={safeUrl} 
                target={safeUrl.startsWith('http') ? "_blank" : "_self"}
                rel={safeUrl.startsWith('http') ? "noopener noreferrer" : undefined}
                className="group inline-flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              >

                <span className={
                  isSubstack 
                    ? "font-semibold text-orange-500 group-hover:underline flex items-center gap-1.5" 
                    : isNodeWiki
                    ? "font-semibold text-[var(--accent)] group-hover:underline flex items-center gap-1.5"
                    : "font-medium text-[var(--text-primary)] group-hover:underline"
                }>
                  {isSubstack && <span>🍊</span>}
                  {isNodeWiki && <span>🧠</span>}
                  {source.title}
                </span>
                <span className="flex items-center gap-1 opacity-80 text-xs font-mono text-[var(--text-secondary)]">
                  <span className="italic">{source.publisher}</span>
                  <span>•</span>
                  <span>{source.date}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default SourceList;
