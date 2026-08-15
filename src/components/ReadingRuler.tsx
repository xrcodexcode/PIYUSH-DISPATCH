'use client';

import React, { useState, useEffect } from 'react';

export function ReadingRuler() {
  const [enabled, setEnabled] = useState(false);
  const [mouseY, setMouseY] = useState<number | null>(null);

  useEffect(() => {
    const updateRulerState = () => {
      try {
        const isEnabled = localStorage.getItem('reader_ruler_enabled') === 'true';
        setEnabled(isEnabled);
      } catch {
        setEnabled(false);
      }
    };

    updateRulerState();
    window.addEventListener('reader-ruler-updated', updateRulerState);
    return () => window.removeEventListener('reader-ruler-updated', updateRulerState);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMouseY(e.clientY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled || mouseY === null) return null;

  return (
    <div
      style={{ top: `${mouseY - 16}px` }}
      className="fixed left-0 right-0 h-10 pointer-events-none z-[999] border-y border-[var(--accent)]/30 bg-[var(--accent)]/5 backdrop-blur-[0.5px] transition-transform duration-75 ease-out"
    />
  );
}

export default ReadingRuler;
