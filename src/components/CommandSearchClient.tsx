'use client';

import React, { useState, useEffect } from 'react';
import { CommandSearchModal } from './CommandSearchModal';
import { IssueSummary } from '@/types';

export function CommandSearchClient({ issues }: { issues: IssueSummary[] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <CommandSearchModal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
      issues={issues} 
    />
  );
}
