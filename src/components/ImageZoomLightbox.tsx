'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export function ImageZoomLightbox() {
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);
  const [imageScale, setImageScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const closeLightbox = useCallback(() => {
    setActiveImage(null);
    setImageScale(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setImageScale(prev => Math.min(prev + 0.5, 2.5));
  }, []);

  const zoomOut = useCallback(() => {
    setImageScale(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) {
        setPanOffset({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setImageScale(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Attach click listeners to all article images
  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLImageElement;
      if (target && target.tagName === 'IMG') {
        const isInsideProse = target.closest('.prose');
        const isInsideHero = target.closest('.hero-image-wrapper');
        
        if (isInsideProse || isInsideHero) {
          e.preventDefault();
          setActiveImage({
            src: target.src || target.currentSrc,
            alt: target.alt || 'Dispatch High-Resolution Illustration',
          });
          setImageScale(1);
          setPanOffset({ x: 0, y: 0 });
        }
      }
    };

    document.addEventListener('click', handleImageClick);
    return () => document.removeEventListener('click', handleImageClick);
  }, []);

  // Keyboard navigation inside lightbox
  useEffect(() => {
    if (!activeImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    };

    // Lock body scroll while lightbox is active
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeImage, closeLightbox, zoomIn, zoomOut, resetZoom]);

  // Mouse pan handlers for magnified inspection
  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageScale > 1) {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageScale > 1) {
      e.preventDefault();
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      setPanOffset({ x: newX, y: newY });
      currentPanRef.current = { x: newX, y: newY };
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!activeImage) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/92 backdrop-blur-xl select-none animate-fadeIn transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeLightbox();
        }
      }}
    >
      {/* Lightbox Top Controls HUD */}
      <div className="absolute top-5 left-0 right-0 px-6 flex justify-between items-center z-10 pointer-events-auto">
        {/* Zoom Controls Stepper */}
        <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-700/80 backdrop-blur-md rounded-full px-3 py-1.5 shadow-2xl">
          <button
            onClick={zoomOut}
            disabled={imageScale <= 1}
            title="Zoom Out (-)"
            className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-mono font-bold text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            -
          </button>

          <span className="text-xs font-mono font-bold text-white min-w-[50px] text-center">
            {Math.round(imageScale * 100)}%
          </span>

          <button
            onClick={zoomIn}
            disabled={imageScale >= 2.5}
            title="Zoom In (+)"
            className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-mono font-bold text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            +
          </button>

          {imageScale !== 1 && (
            <button
              onClick={resetZoom}
              title="Reset Zoom (0)"
              className="text-[11px] font-mono text-[var(--accent)] hover:underline ml-1 px-1.5 py-0.5 rounded bg-neutral-800"
            >
              Reset
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={closeLightbox}
          title="Close Lightbox (Esc)"
          aria-label="Close Lightbox"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900/80 border border-neutral-700/80 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all shadow-2xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Image Display & Inspection Canvas */}
      <div 
        className="w-full h-full flex items-center justify-center p-6 sm:p-12 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: imageScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <img
          src={activeImage.src}
          alt={activeImage.alt}
          style={{
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${imageScale})`,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            maxHeight: '85vh',
            maxWidth: '92vw',
          }}
          className="object-contain rounded-lg shadow-2xl pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* Caption & Instructions Footer */}
      {activeImage.alt && (
        <div className="absolute bottom-5 left-0 right-0 px-6 flex flex-col items-center pointer-events-none">
          <p className="max-w-2xl text-center text-xs text-neutral-300 font-sans px-4 py-2 rounded-lg bg-black/60 backdrop-blur-md border border-neutral-800 shadow-xl">
            {activeImage.alt}
          </p>
          <span className="text-[10px] font-mono text-neutral-500 mt-1.5">
            Tip: Use + / - keys to zoom, click and drag to pan, Esc to close
          </span>
        </div>
      )}
    </div>
  );
}

export default ImageZoomLightbox;
