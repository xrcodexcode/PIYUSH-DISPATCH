'use client';

import React, { useRef, useEffect } from 'react';
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
    <div className={cn("w-full max-w-xl mx-auto", className)}>
      <div className="relative group transition-all duration-300">
        {/* Subtle Ambient Focus Ring */}
        <div className="absolute -inset-0.5 bg-[var(--accent)] rounded-xl blur-xs opacity-0 group-focus-within:opacity-30 transition duration-300" />
        
        <div className="relative flex items-center bg-[var(--surface)] border border-[var(--border-color)] rounded-xl shadow-2xs overflow-hidden group-focus-within:border-[var(--accent)] transition-all">
          {/* Search Icon */}
          <div className="pl-3.5 pr-2.5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Compact Input */}
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            maxLength={200}
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, 200))}
            placeholder={placeholder}
            className="w-full bg-transparent py-2.5 pr-9 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:outline-none font-medium"
          />


          {/* Clear Button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg)] transition-colors"
              title="Clear search query"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
