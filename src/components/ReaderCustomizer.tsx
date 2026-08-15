'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type ReaderFont = 'serif' | 'sans' | 'mono';
export type ReaderSize = 'compact' | 'default' | 'large' | 'xlarge';
export type ReaderWidth = 'compact' | 'default' | 'wide';

interface ReaderPreferences {
  font: ReaderFont;
  size: ReaderSize;
  width: ReaderWidth;
}

const DEFAULT_PREFS: ReaderPreferences = {
  font: 'sans',
  size: 'default',
  width: 'default',
};

export function ReaderCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState<ReaderPreferences>(DEFAULT_PREFS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize and apply preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('reader_preferences');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ReaderPreferences>;
        const merged: ReaderPreferences = {
          font: (['serif', 'sans', 'mono'].includes(parsed.font || '') ? parsed.font : DEFAULT_PREFS.font) as ReaderFont,
          size: (['compact', 'default', 'large', 'xlarge'].includes(parsed.size || '') ? parsed.size : DEFAULT_PREFS.size) as ReaderSize,
          width: (['compact', 'default', 'wide'].includes(parsed.width || '') ? parsed.width : DEFAULT_PREFS.width) as ReaderWidth,
        };
        setPrefs(merged);
        applyPrefsToDom(merged);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const applyPrefsToDom = (p: ReaderPreferences) => {
    document.documentElement.setAttribute('data-reader-font', p.font);
    document.documentElement.setAttribute('data-reader-size', p.size);
    document.documentElement.setAttribute('data-reader-width', p.width);
  };

  const updatePreference = <K extends keyof ReaderPreferences>(key: K, value: ReaderPreferences[K]) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    applyPrefsToDom(updated);
    try {
      localStorage.setItem('reader_preferences', JSON.stringify(updated));
    } catch {
      // safe no-op
    }
  };

  const resetPreferences = () => {
    setPrefs(DEFAULT_PREFS);
    applyPrefsToDom(DEFAULT_PREFS);
    try {
      localStorage.removeItem('reader_preferences');
    } catch {
      // safe no-op
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Reading Typography & Layout Preferences"
        title="Customize Font, Text Size & Reading Column Width"
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition-all border shadow-2xs cursor-pointer",
          isOpen
            ? "bg-[var(--accent)] text-white border-[var(--accent)]"
            : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
        )}
      >
        <span className="font-serif font-bold text-sm leading-none">Aa</span>
        <span className="hidden sm:inline text-[11px]">Display</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] shadow-2xl z-50 p-4 space-y-4 backdrop-blur-md animate-fadeIn text-[var(--text-primary)]">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
              Reading Layout
            </span>
            <button
              onClick={resetPreferences}
              className="text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Font Family Selection */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] font-semibold">
              Typeface
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--bg)] border border-[var(--border-color)] rounded-xl">
              <button
                onClick={() => updatePreference('font', 'sans')}
                className={cn(
                  "py-1 px-2 rounded-lg text-xs font-sans font-medium transition-all text-center",
                  prefs.font === 'sans'
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Sans
              </button>
              <button
                onClick={() => updatePreference('font', 'serif')}
                className={cn(
                  "py-1 px-2 rounded-lg text-xs font-serif font-medium transition-all text-center",
                  prefs.font === 'serif'
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Serif
              </button>
              <button
                onClick={() => updatePreference('font', 'mono')}
                className={cn(
                  "py-1 px-2 rounded-lg text-xs font-mono font-medium transition-all text-center",
                  prefs.font === 'mono'
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Mono
              </button>
            </div>
          </div>

          {/* Font Size Selection */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] font-semibold">
              Text Size
            </span>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[var(--bg)] border border-[var(--border-color)] rounded-xl text-center">
              {(
                [
                  { id: 'compact', label: 'A-', title: 'Compact (16px)' },
                  { id: 'default', label: 'A', title: 'Default (18px)' },
                  { id: 'large', label: 'A+', title: 'Large (20px)' },
                  { id: 'xlarge', label: 'A++', title: 'Extra Large (22px)' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  onClick={() => updatePreference('size', s.id)}
                  title={s.title}
                  className={cn(
                    "py-1 rounded-lg text-xs font-mono font-bold transition-all",
                    prefs.size === s.id
                      ? "bg-[var(--accent)] text-white shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column Width Selection */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] font-semibold">
              Reading Width
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--bg)] border border-[var(--border-color)] rounded-xl text-center">
              {(
                [
                  { id: 'compact', label: 'Narrow', title: '680px max width' },
                  { id: 'default', label: 'Standard', title: '760px max width' },
                  { id: 'wide', label: 'Wide', title: '880px max width' },
                ] as const
              ).map((w) => (
                <button
                  key={w.id}
                  onClick={() => updatePreference('width', w.id)}
                  className={cn(
                    "py-1 px-2 rounded-lg text-[11px] font-mono transition-all",
                    prefs.width === w.id
                      ? "bg-[var(--accent)] text-white font-bold shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {w.label}
                </button>
                ))}
              </div>
            </div>

            {/* Reading Ruler Toggle */}
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] font-semibold">
              Reading Focus Ruler
            </span>
            <button
              onClick={() => {
                const current = localStorage.getItem('reader_ruler_enabled') === 'true';
                localStorage.setItem('reader_ruler_enabled', String(!current));
                window.dispatchEvent(new Event('reader-ruler-updated'));
              }}
              className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg)] text-[11px] font-mono text-[var(--text-primary)] hover:border-[var(--accent)] cursor-pointer"
            >
              Toggle Ruler 📏
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReaderCustomizer;
