'use client';

import { useEffect, useRef } from 'react';
import { sanitizeSlug } from '@/lib/security';

interface ReadTrackerProps {
  issueSlug: string;
}

export function ReadTracker({ issueSlug }: ReadTrackerProps) {
  const cleanSlug = sanitizeSlug(issueSlug);
  const markedRef = useRef(false);

  useEffect(() => {
    if (!cleanSlug || markedRef.current) return;

    const markAsRead = () => {
      try {
        const raw = localStorage.getItem('read_dispatches');
        let list: string[] = [];
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            list = parsed.map(sanitizeSlug).filter((s): s is string => Boolean(s) && s.length > 0);
          }
        }
        if (!list.includes(cleanSlug)) {
          const updated = [...list, cleanSlug].slice(-300);
          localStorage.setItem('read_dispatches', JSON.stringify(updated));
          window.dispatchEvent(new Event('read-dispatches-updated'));
        }
        markedRef.current = true;
      } catch {
        // safe fallback
      }
    };

    let ticking = false;
    const handleScroll = () => {
      if (markedRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0 && scrollY / totalHeight >= 0.7) {
            markAsRead();
            window.removeEventListener('scroll', handleScroll);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [cleanSlug]);

  return null;
}

export default ReadTracker;
