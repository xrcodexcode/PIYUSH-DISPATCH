'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PrintButtonProps {
  className?: string;
}

export function PrintButton({ className }: PrintButtonProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      title="Export Clean PDF / Print Briefing"
      aria-label="Export Clean PDF or Print"
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition-all border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] shadow-2xs cursor-pointer",
        className
      )}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      <span className="hidden sm:inline text-[11px]">PDF / Print</span>
    </button>
  );
}

export default PrintButton;
