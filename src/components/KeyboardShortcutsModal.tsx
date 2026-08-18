'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { cycleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 't' || e.key === 'T') {
        cycleTheme();
      } else if (e.key === '/') {
        e.preventDefault();
        router.push('/search');
      } else if (e.key === 'Z' && e.shiftKey) {
        e.preventDefault();
        const isZenActive = document.body.classList.toggle('zen-mode');
        if (isZenActive && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else if (!isZenActive && document.exitFullscreen && document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cycleTheme, router]);

  if (!isOpen) return (
    <button
      onClick={() => setIsOpen(true)}
      title="Press '?' for keyboard shortcuts"
      className="hidden md:flex items-center gap-1 text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--surface)] transition-colors"
    >
      <kbd className="font-sans font-semibold">?</kbd>
      <span>Shortcuts</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-[var(--text-primary)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-xl">Keyboard Shortcuts</span>
            <span className="text-xs font-mono bg-[var(--accent)] text-white px-2 py-0.5 rounded-full font-bold">Pro</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]/50">
            <span className="text-[var(--text-secondary)]">Toggle Theme Engine</span>
            <kbd className="px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border-color)] font-bold text-[var(--accent)]">T</kbd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]/50">
            <span className="text-[var(--text-secondary)]">Fullscreen Zen Mode</span>
            <kbd className="px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border-color)] font-bold text-[var(--accent)]">Shift + Z</kbd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]/50">
            <span className="text-[var(--text-secondary)]">Open Search Archive</span>
            <kbd className="px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border-color)] font-bold text-[var(--accent)]">/</kbd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]/50">
            <span className="text-[var(--text-secondary)]">Toggle Shortcuts Modal</span>
            <kbd className="px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border-color)] font-bold text-[var(--accent)]">?</kbd>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[var(--text-secondary)]">Close Modal / Exit</span>
            <kbd className="px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border-color)] font-bold text-[var(--accent)]">Esc</kbd>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] font-mono text-[var(--text-secondary)]">
          Piyush&apos;s Dispatch — Built for Power Readers
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsModal;
