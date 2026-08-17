'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '@/components/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme, cycleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const amoledThemes: { id: Theme; label: string; icon: string }[] = [
    { id: 'amoled-dark', label: 'AMOLED Dark', icon: '🌑⬛' },
    { id: 'amoled-paper', label: 'AMOLED Paper', icon: '📜⬛' },
    { id: 'amoled-obsidian', label: 'AMOLED Obsidian', icon: '⬛' },
    { id: 'amoled-matcha', label: 'AMOLED Matcha', icon: '🍵⬛' },
    { id: 'amoled-cyber', label: 'AMOLED Cyber', icon: '🌆⬛' },
    { id: 'amoled-espresso', label: 'AMOLED Espresso', icon: '☕⬛' },
    { id: 'amoled-crimson', label: 'AMOLED Crimson', icon: '🍷⬛' },
    { id: 'amoled-forest', label: 'AMOLED Forest', icon: '🌲⬛' },
    { id: 'amoled-nordic', label: 'AMOLED Nordic', icon: '🌊⬛' },
  ];

  const standardThemes: { id: Theme; label: string; icon: string }[] = [
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
    { id: 'midnight', label: 'Midnight', icon: '🌌' },
    { id: 'forest', label: 'Forest', icon: '🌲' },
    { id: 'nordic', label: 'Nordic', icon: '🌊' },
    { id: 'espresso', label: 'Espresso', icon: '☕' },
    { id: 'crimson', label: 'Crimson', icon: '🍷' },
  ];

  const allThemes = [...amoledThemes, ...standardThemes];
  const currentThemeObj = allThemes.find(t => t.id === theme) || amoledThemes[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onContextMenu={(e) => { e.preventDefault(); cycleTheme(); }}
        aria-label="Theme selector"
        title="Click to select theme, right-click to quick cycle through 15 themes"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all text-xs font-medium shadow-xs"
      >
        <span>{currentThemeObj.icon}</span>
        <span className="capitalize hidden sm:inline">{currentThemeObj.label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] shadow-2xl z-50 p-2 space-y-1 backdrop-blur-md">
          <div className="max-h-80 overflow-y-auto pr-1">
            {/* 9 AMOLED Pure Black Themes */}
            <div className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 text-[var(--accent)] font-bold">
              AMOLED Pure Black (#000) (9)
            </div>
            {amoledThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl transition-colors ${
                  theme === t.id
                    ? 'bg-[var(--accent)] text-white font-semibold shadow-xs'
                    : 'hover:bg-[var(--border-color)] text-[var(--text-primary)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </span>
                {theme === t.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            ))}

            {/* Standard Editorial Themes */}
            <div className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 text-[var(--text-secondary)] font-semibold mt-2 pt-2 border-t border-[var(--border-color)]">
              Editorial Themes (7)
            </div>
            {standardThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl transition-colors ${
                  theme === t.id
                    ? 'bg-[var(--accent)] text-white font-semibold shadow-xs'
                    : 'hover:bg-[var(--border-color)] text-[var(--text-primary)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </span>
                {theme === t.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeToggle;
