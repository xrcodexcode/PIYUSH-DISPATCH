'use client';

import React, { useState, useEffect, useCallback } from 'react';

const ZOOM_LEVELS = [100, 125, 150, 175, 200];
const STORAGE_KEY = 'dispatch_focus_zoom';

export function ZenReadingControls() {
  const [isZen, setIsZen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [mounted, setMounted] = useState(false);

  // Apply zoom to CSS variables and persist to localStorage
  const applyZoom = useCallback((newZoom: number) => {
    setZoomLevel(newZoom);
    const scale = newZoom / 100;
    document.documentElement.style.setProperty('--reading-zoom-scale', scale.toString());
    try {
      localStorage.setItem(STORAGE_KEY, newZoom.toString());
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  // Initialize from storage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (ZOOM_LEVELS.includes(parsed)) {
          applyZoom(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [applyZoom]);

  const zoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      applyZoom(ZOOM_LEVELS[currentIndex + 1]);
    }
  };

  const zoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
    if (currentIndex > 0) {
      applyZoom(ZOOM_LEVELS[currentIndex - 1]);
    }
  };

  const resetZoom = () => {
    applyZoom(100);
  };

  const toggleZen = () => {
    const nextZen = !isZen;
    setIsZen(nextZen);

    if (nextZen) {
      document.body.classList.add('zen-mode');
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      document.body.classList.remove('zen-mode');
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isZen) {
        setIsZen(false);
        document.body.classList.remove('zen-mode');
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isZen]);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Alt + ] = Zoom In
      if (e.altKey && (e.key === ']' || e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
      }
      // Alt + [ = Zoom Out
      else if (e.altKey && (e.key === '[' || e.key === '-')) {
        e.preventDefault();
        zoomOut();
      }
      // Alt + 0 = Reset Zoom
      else if (e.altKey && e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
      // Alt + Z = Toggle Zen Focus
      else if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        toggleZen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomLevel, isZen]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-7 w-32 bg-[var(--surface)] animate-pulse rounded-full" />
      </div>
    );
  }

  const isMinZoom = zoomLevel === ZOOM_LEVELS[0];
  const isMaxZoom = zoomLevel === ZOOM_LEVELS[ZOOM_LEVELS.length - 1];

  return (
    <>
      {/* Inline controls bar widget */}
      <div className="flex items-center gap-2">
        {/* Dynamic Zoom Stepper */}
        <div 
          className="flex items-center bg-[var(--surface)] border border-[var(--border-color)] rounded-full px-1.5 py-0.5 shadow-xs transition-colors"
          role="group"
          aria-label="Reading Focus Zoom Controls"
        >
          <button
            onClick={zoomOut}
            disabled={isMinZoom}
            title="Zoom Out (Alt + [)"
            aria-label="Zoom Out"
            className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <button
            onClick={resetZoom}
            title={zoomLevel !== 100 ? "Reset to 100% (Alt + 0)" : "Current Zoom: 100%"}
            aria-label={`Focus Zoom Level: ${zoomLevel}%`}
            className="px-2 py-0.5 text-xs font-mono font-bold tracking-tight text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors min-w-[46px] text-center"
          >
            {zoomLevel}%
          </button>

          <button
            onClick={zoomIn}
            disabled={isMaxZoom}
            title="Zoom In (Alt + ])"
            aria-label="Zoom In"
            className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Zen Focus Mode Button */}
        <button
          onClick={toggleZen}
          aria-label="Toggle Fullscreen Focus Mode"
          title="Toggle Fullscreen Focus Mode (Alt + Z)"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-xs ${
            isZen 
              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
              : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--accent)]'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isZen ? (
              <>
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </>
            ) : (
              <>
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </>
            )}
          </svg>
          <span className="hidden sm:inline">{isZen ? 'Exit Fullscreen' : 'Zen Focus'}</span>
        </button>
      </div>

      {/* Floating HUD Bar visible only in Zen Mode */}
      {isZen && (
        <div className="zen-exit-floating-btn fixed top-6 right-6 z-[9999] flex items-center gap-2 bg-[var(--surface)]/90 backdrop-blur-md p-1.5 rounded-full border border-[var(--border-color)] shadow-2xl">
          {/* Zoom Stepper in Floating Zen HUD */}
          <div className="flex items-center bg-[var(--bg)] border border-[var(--border-color)] rounded-full px-2 py-0.5">
            <button
              onClick={zoomOut}
              disabled={isMinZoom}
              aria-label="Zoom Out"
              className="w-5 h-5 flex items-center justify-center text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30"
            >
              -
            </button>
            <span className="px-2 text-xs font-mono font-bold text-[var(--text-primary)]">
              {zoomLevel}%
            </span>
            <button
              onClick={zoomIn}
              disabled={isMaxZoom}
              aria-label="Zoom In"
              className="w-5 h-5 flex items-center justify-center text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30"
            >
              +
            </button>
          </div>

          {/* Exit Zen Button */}
          <button
            onClick={toggleZen}
            aria-label="Exit Fullscreen Mode"
            className="px-3.5 py-1.5 bg-[var(--accent)] text-white rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            <span>Exit Zen</span>
          </button>
        </div>
      )}
    </>
  );
}

export default ZenReadingControls;
