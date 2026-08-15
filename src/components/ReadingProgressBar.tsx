'use client';

import React, { useState, useEffect } from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY || document.documentElement.scrollTop;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

          if (totalHeight > 0) {
            const pct = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
            setProgress(pct);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[100000] pointer-events-none bg-transparent">
      <div
        className="h-full bg-[var(--accent)] transition-all duration-150 ease-out shadow-[0_0_8px_var(--accent)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default ReadingProgressBar;
