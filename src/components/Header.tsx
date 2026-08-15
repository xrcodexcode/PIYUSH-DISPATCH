'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY || document.documentElement.scrollTop;
          setIsScrolled(currentScroll > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 border-b border-transparent bg-[var(--bg)] text-[var(--text-primary)] relative",
      isScrolled && "border-[var(--border-color)] shadow-xs bg-[var(--bg)]/95 backdrop-blur-md"
    )}>
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-wrap justify-between items-center gap-3 h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-serif font-black text-xl sm:text-2xl tracking-tight text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
              {"PIYUSH'S DISPATCH"}
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex md:flex-wrap md:justify-end gap-3 lg:gap-4 items-center text-sm font-medium w-full md:w-auto">
            <Link href="/issues" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap">All Dispatches</Link>
            <Link href="/issues?type=daily-node" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 whitespace-nowrap">
              <span>⚡</span> The Daily Nodes
            </Link>
            <Link href="/issues?type=deep-node" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 whitespace-nowrap">
              <span>🧠</span> The Deep Nodes
            </Link>
            <Link href="/issues/saved" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 whitespace-nowrap">
              <span>🔖</span> Saved Vault
            </Link>
            <Link href="/about" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap">About</Link>
            
            <div className="flex items-center space-x-3 ml-2 pl-4 border-l border-[var(--border-color)]">
              <ThemeToggle />
              <Link href="/search" aria-label="Search" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors p-2 rounded-full hover:bg-[var(--surface)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </Link>
              <a 
                href="https://xrcodex.substack.com/subscribe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[var(--accent)] hover:opacity-90 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-xs hover:shadow-md inline-flex items-center gap-1"
              >
                <span>Subscribe</span>
                <span className="text-xs">↗</span>
              </a>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-3">
            <ThemeToggle />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface)]"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg)] px-6 py-6 shadow-xl">
          <div className="space-y-2">
            <Link href="/issues" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-lg font-medium text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-xl">All Dispatches</Link>
            <Link href="/issues?type=daily-node" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-lg font-medium text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-xl">⚡ The Daily Nodes</Link>
            <Link href="/issues?type=deep-node" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-lg font-medium text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-xl">🧠 The Deep Nodes</Link>
            <Link href="/issues/saved" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-lg font-medium text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-xl">🔖 Saved Vault</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-lg font-medium text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-xl">About</Link>
            <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-lg font-medium text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-xl">Search</Link>
            <div className="pt-4 mt-2 border-t border-[var(--border-color)]">
              <a 
                href="https://xrcodex.substack.com/subscribe" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)} 
                className="block w-full text-center bg-[var(--accent)] text-white px-5 py-3 rounded-full text-base font-semibold shadow-md"
              >
                Subscribe on Substack ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
