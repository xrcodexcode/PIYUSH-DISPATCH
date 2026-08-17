import React from 'react';
import Link from 'next/link';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg)] text-[var(--text-primary)] py-16 mt-24">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif font-black text-2xl tracking-tight text-[var(--text-primary)] inline-block mb-4 hover:text-[var(--accent)] transition-colors">
              PIYUSH&apos;S DISPATCH
            </Link>
            <p className="text-[var(--text-secondary)] max-w-md mb-6 leading-relaxed text-base font-normal">
              Understanding the technology behind the headlines, the architecture behind the products, and the ideas behind the companies shaping the future.
            </p>
            <div className="flex space-x-5 text-[var(--text-secondary)]">
              {/* X/Twitter */}
              <a 
                href="https://x.com/PiyushPal143104" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="X (formerly Twitter)" 
                title="Follow Piyush on X"
                className="hover:text-[var(--accent)] transition-colors p-2.5 rounded-full bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--accent)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              {/* GitHub */}
              <a 
                href="https://github.com/xrcodexcode" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub" 
                title="Piyush on GitHub"
                className="hover:text-[var(--accent)] transition-colors p-2.5 rounded-full bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--accent)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/xrcodex/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                title="Connect with Piyush on LinkedIn"
                className="hover:text-[var(--accent)] transition-colors p-2.5 rounded-full bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--accent)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-xs font-mono tracking-widest uppercase">Navigation</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm">Home</Link></li>
              <li><Link href="/issues" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm">All Dispatches</Link></li>
              <li><Link href="/topics" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm">Topics</Link></li>
              <li><Link href="/about" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm">About Author</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-xs font-mono tracking-widest uppercase">Publication</h3>
            <ul className="space-y-3">
              <li><a href="https://xrcodex.substack.com/subscribe" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm flex items-center gap-1"><span>Subscribe on Substack</span><span className="text-xs">↗</span></a></li>
              <li><Link href="/search" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm">Archive Search</Link></li>
              <li><Link href="/issues/latest" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm">Today&apos;s Issue</Link></li>
              <li><Link href="/contact" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--border-color)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--text-secondary)]">
          <p>&copy; {currentYear} Piyush&apos;s Dispatch. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <KeyboardShortcutsModal />
            <p className="font-mono italic">Built with curiosity &amp; senior web standards.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
