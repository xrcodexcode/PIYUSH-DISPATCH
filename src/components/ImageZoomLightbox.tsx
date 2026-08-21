'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export function ImageZoomLightbox() {
  const [allImages, setAllImages] = useState<{ src: string; alt: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const activeImage = currentIndex >= 0 && currentIndex < allImages.length ? allImages[currentIndex] : null;

  const [imageScale, setImageScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const closeLightbox = useCallback(() => {
    setCurrentIndex(-1);
    setAllImages([]);
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

  const goToNext = useCallback(() => {
    if (currentIndex < allImages.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetZoom();
    }
  }, [currentIndex, allImages.length, resetZoom]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetZoom();
    }
  }, [currentIndex, resetZoom]);

  // Attach click listeners to all article images
  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLImageElement;
      if (target && target.tagName === 'IMG') {
        const isInsideProse = target.closest('.prose');
        const isInsideHero = target.closest('.hero-image-wrapper');
        
        if (isInsideProse || isInsideHero) {
          e.preventDefault();
          const imageNodes = Array.from(document.querySelectorAll('.prose img, .hero-image-wrapper img')) as HTMLImageElement[];
          const imagesList = imageNodes.map(img => ({
            src: img.src || img.currentSrc,
            alt: img.alt || 'Dispatch High-Resolution Illustration'
          }));
          
          const clickedSrc = target.src || target.currentSrc;
          const index = imagesList.findIndex(img => img.src === clickedSrc);
          
          setAllImages(imagesList);
          setCurrentIndex(index !== -1 ? index : 0);
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
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      }
    };

    // Lock body scroll while lightbox is active
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeImage, closeLightbox, zoomIn, zoomOut, resetZoom, goToNext, goToPrev]);

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

        {/* Close Button & Image Counter */}
        <div className="flex items-center gap-4 bg-neutral-900/80 border border-neutral-700/80 backdrop-blur-md rounded-full px-4 py-1.5 shadow-2xl">
          <span className="text-xs font-mono font-bold text-neutral-400">
            {currentIndex + 1} / {allImages.length}
          </span>
          <div className="w-[1px] h-4 bg-neutral-700"></div>
          <button
            onClick={closeLightbox}
            title="Close Lightbox (Esc)"
            aria-label="Close Lightbox"
            className="w-6 h-6 flex items-center justify-center rounded-full text-neutral-300 hover:text-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Previous Arrow */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goToPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-900/50 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors z-20"
          aria-label="Previous Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      )}

      {/* Next Arrow */}
      {currentIndex < allImages.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-900/50 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors z-20"
          aria-label="Next Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      )}

      {/* Image Display & Inspection Canvas */}
      <div 
        className="w-full h-full flex flex-col items-center justify-center pt-24 pb-8 px-6 sm:px-12 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: imageScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage.src}
          alt={activeImage.alt}
          style={{
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${imageScale})`,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="object-contain rounded-lg shadow-2xl pointer-events-none select-none flex-1 min-h-0 max-h-full max-w-full"
          draggable={false}
        />

        {/* Caption */}
        {activeImage.alt && (
          <div className="mt-6 shrink-0 flex items-center justify-center pointer-events-none">
            <p className="max-w-2xl text-center text-sm text-neutral-300 font-sans px-5 py-2.5 rounded-lg bg-black/60 backdrop-blur-md border border-neutral-800 shadow-xl leading-relaxed">
              {activeImage.alt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageZoomLightbox;
