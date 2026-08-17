'use client';

import React, { useState, useEffect, useCallback } from 'react';

const LINE_STEP_PX = 32;

export function ReadingRuler() {
  const [enabled, setEnabled] = useState(false);
  const [rulerY, setRulerY] = useState<number | null>(null);
  const [isOverMedia, setIsOverMedia] = useState(false);

  // Check if a point (x, y) is hovering over an image or media element
  const checkIsMediaAtPoint = useCallback((x: number, y: number): boolean => {
    if (typeof document === 'undefined') return false;
    try {
      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      if (!el) return false;
      return Boolean(
        el.closest('img, figure, picture, svg:not(.inline-icon), .hero-image-wrapper, video, audio, [data-is-media="true"]')
      );
    } catch {
      return false;
    }
  }, []);

  // Sync ruler enabled state from localStorage/custom event
  useEffect(() => {
    const updateRulerState = () => {
      try {
        const isEnabled = localStorage.getItem('reader_ruler_enabled') === 'true';
        setEnabled(isEnabled);
        if (isEnabled && rulerY === null && typeof window !== 'undefined') {
          const initialY = Math.round(window.innerHeight * 0.35);
          setRulerY(initialY);
          setIsOverMedia(checkIsMediaAtPoint(window.innerWidth / 2, initialY));
        }
      } catch {
        setEnabled(false);
      }
    };

    updateRulerState();
    window.addEventListener('reader-ruler-updated', updateRulerState);
    return () => window.removeEventListener('reader-ruler-updated', updateRulerState);
  }, [rulerY, checkIsMediaAtPoint]);

  // Mouse tracking with image collision detection
  useEffect(() => {
    if (!enabled) return;

    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setRulerY(e.clientY);
          const isMedia = checkIsMediaAtPoint(e.clientX, e.clientY);
          setIsOverMedia(isMedia);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, checkIsMediaAtPoint]);

  // Keyboard navigation: Down/Up arrows move 1 line at a time
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keystrokes when typing inside inputs, textareas, or contentEditable elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Step Down: 1 line
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setRulerY((prev) => {
          const current = prev ?? Math.round(window.innerHeight * 0.35);
          const next = current + LINE_STEP_PX;

          // Check if destination is media
          if (typeof window !== 'undefined') {
            setIsOverMedia(checkIsMediaAtPoint(window.innerWidth / 2, next));
          }

          // If ruler is nearing the bottom edge of the viewport, scroll window down by 1 line
          if (next > window.innerHeight - 140) {
            window.scrollBy({ top: LINE_STEP_PX, behavior: 'smooth' });
            return Math.min(window.innerHeight - 120, next - (LINE_STEP_PX / 2));
          }
          return Math.min(window.innerHeight - 40, next);
        });
      }

      // Step Up: 1 line
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setRulerY((prev) => {
          const current = prev ?? Math.round(window.innerHeight * 0.35);
          const next = current - LINE_STEP_PX;

          // Check if destination is media
          if (typeof window !== 'undefined') {
            setIsOverMedia(checkIsMediaAtPoint(window.innerWidth / 2, next));
          }

          // If ruler is nearing the top edge of the viewport, scroll window up by 1 line
          if (next < 120) {
            window.scrollBy({ top: -LINE_STEP_PX, behavior: 'smooth' });
            return Math.max(100, next + (LINE_STEP_PX / 2));
          }
          return Math.max(40, next);
        });
      }

      // Escape: Close ruler
      if (e.key === 'Escape') {
        try {
          localStorage.setItem('reader_ruler_enabled', 'false');
          setEnabled(false);
          window.dispatchEvent(new Event('reader-ruler-updated'));
        } catch {
          // safe fallback
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, checkIsMediaAtPoint]);

  if (!enabled || rulerY === null) return null;

  return (
    <div
      style={{ top: `${rulerY - 18}px` }}
      className={`fixed left-0 right-0 h-9 pointer-events-none z-[999] border-y border-[var(--accent)]/35 bg-[var(--accent)]/6 backdrop-blur-[0.5px] transition-all duration-100 ease-out shadow-[0_0_15px_rgba(0,0,0,0.15)] flex items-center justify-between px-4 text-[10px] font-mono text-[var(--accent)] select-none ${
        isOverMedia ? 'opacity-0 scale-y-75' : 'opacity-85 scale-y-100'
      }`}
    >
      <span className="hidden md:inline-block tracking-wider font-semibold opacity-60">
        ── FOCUS LINE
      </span>
      <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border-color)] text-[9px] text-[var(--text-secondary)] shadow-xs">
        ↓ / ↑ or j / k to step line • Esc to exit
      </span>
    </div>
  );
}

export default ReadingRuler;
