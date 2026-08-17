'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function ReadingStreakWidget() {
  const [streakCount, setStreakCount] = useState(1);
  const [activeDays, setActiveDays] = useState<boolean[]>([false, false, false, false, false, true, true]);
  const [dayLabels, setDayLabels] = useState<string[]>(['M', 'T', 'W', 'T', 'F', 'S', 'S']);

  useEffect(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const raw = localStorage.getItem('reading_activity_dates');
      let dates: string[] = raw ? JSON.parse(raw) : [];

      if (!dates.includes(todayStr)) {
        dates = [...dates, todayStr].slice(-30);
        localStorage.setItem('reading_activity_dates', JSON.stringify(dates));
      }

      // Calculate streak
      let streak = 1;
      const sorted = [...dates].sort().reverse();
      const today = new Date();

      for (let i = 1; i < 30; i++) {
        const prev = new Date(today);
        prev.setDate(today.getDate() - i);
        const prevStr = prev.toISOString().split('T')[0];
        if (sorted.includes(prevStr)) {
          streak++;
        } else {
          break;
        }
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStreakCount(Math.max(1, streak));

      // Calculate past 7 days activity with accurate rolling day labels
      const days = [];
      const labels = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        days.push(dates.includes(dStr));
        labels.push(d.toLocaleDateString('en-US', { weekday: 'narrow' }));
      }
      setActiveDays(days);
      setDayLabels(labels);
    } catch {
      // safe fallback
    }
  }, []);

  

  return (
    <div className="p-4 md:p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center text-xl shrink-0">
          🔥
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
              {streakCount}-Day Reading Streak
            </span>
            <span className="px-2 py-0.2 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-mono font-bold">
              Active Reader
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Consistently ingesting high-signal engineering intelligence
          </p>
        </div>
      </div>

      {/* 7-Day Activity Week Tracker */}
      <div className="flex items-center gap-1.5 bg-[var(--bg)] p-1.5 rounded-xl border border-[var(--border-color)]">
        {activeDays.map((isActive, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-mono text-[var(--text-secondary)] font-semibold">
              {dayLabels[idx]}
            </span>
            <div
              className={cn(
                "w-4 h-4 rounded-full transition-all flex items-center justify-center text-[8px] font-bold",
                isActive
                  ? "bg-orange-500 text-white shadow-2xs"
                  : "bg-[var(--surface)] border border-[var(--border-color)]"
              )}
            >
              {isActive ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadingStreakWidget;
