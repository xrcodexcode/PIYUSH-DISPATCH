'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search dispatches, titles, keywords...",
  onClear,
  autoFocus = false,
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: Cmd/Ctrl + K to focus search
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      inputRef.current?.focus();
    }
    // Escape to blur
    if (e.key === 'Escape' && document.activeElement === inputRef.current) {
      inputRef.current?.blur();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative group transition-all duration-300">
        <div className="relative flex items-center bg-[var(--bg)] border border-[var(--border-color)] rounded-xl overflow-hidden group-focus-within:border-[var(--accent)] transition-all">
          {/* Search Icon */}
          <div className="pl-4 pr-2.5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            maxLength={200}
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, 200))}
            placeholder={placeholder}
            className="w-full bg-transparent py-3 pr-20 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none font-medium"
          />

          {/* Right side: Clear button + Keyboard shortcut */}
          <div className="absolute right-3 flex items-center gap-2">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors"
                title="Clear search query"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {!value && (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-[var(--border-color)] bg-[var(--surface)] text-[10px] font-mono text-[var(--text-secondary)] font-semibold">
                ⌘K
              </kbd>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
