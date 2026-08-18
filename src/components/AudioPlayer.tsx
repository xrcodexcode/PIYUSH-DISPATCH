'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  title: string;
  textToRead: string;
  readingTimeMinutes?: number;
}

export interface VoiceProfile {
  id: string;
  label: string;
  gender: 'male' | 'female';
  pitch: number;
  rateMultiplier: number;
  matchNames: string[];
  fallbackIndex: number;
}

const MALE_VOICE: VoiceProfile = {
  id: 'male-voice',
  label: '♂ Male Voice',
  gender: 'male',
  pitch: 0.72,
  rateMultiplier: 0.95,
  matchNames: ['alex', 'david', 'mark', 'daniel', 'guy', 'google us english'],
  fallbackIndex: 0
};

const FEMALE_VOICE: VoiceProfile = {
  id: 'female-voice',
  label: '♀ Female Voice',
  gender: 'female',
  pitch: 1.25,
  rateMultiplier: 1.02,
  matchNames: ['samantha', 'zira', 'victoria', 'jenny', 'aria', 'google uk english female'],
  fallbackIndex: 1
};

export function AudioPlayer({ title, textToRead, readingTimeMinutes = 5 }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  
  // Male / Female toggle mode
  const [genderMode, setGenderMode] = useState<'male' | 'female'>('male');
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Clean Markdown into plain reading text
  const cleanedText = useMemo(() => {
    return textToRead
      .replace(/---[\s\S]*?---/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[*_#`~>|-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }, [textToRead]);

  const fullTextToSpeak = useMemo(() => `${title}. ${cleanedText}`, [title, cleanedText]);
  const totalDurationSec = useMemo(() => (readingTimeMinutes * 60) / rate, [readingTimeMinutes, rate]);

  // Load browser system voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSupported(true);

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setSystemVoices(voices);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const activeProfile = useMemo(() => {
    return genderMode === 'male' ? MALE_VOICE : FEMALE_VOICE;
  }, [genderMode]);

  // Match system voice object based on active profile & fallback index
  const getMatchedSystemVoice = (profile: VoiceProfile): SpeechSynthesisVoice | null => {
    if (!systemVoices.length) return null;
    
    // 1. Name match
    for (const name of profile.matchNames) {
      const found = systemVoices.find((v) => v.name.toLowerCase().includes(name));
      if (found) return found;
    }

    // 2. Gender heuristic match
    if (profile.gender === 'female') {
      const femaleFallback = systemVoices.find((v) => /female|zira|samantha|jenny|victoria|aria/i.test(v.name));
      if (femaleFallback) return femaleFallback;
    } else {
      const maleFallback = systemVoices.find((v) => /male|david|alex|daniel|guy/i.test(v.name));
      if (maleFallback) return maleFallback;
    }

    // 3. Fallback to index
    const idx = profile.fallbackIndex % systemVoices.length;
    return systemVoices[idx] || systemVoices[0] || null;
  };

  const startProgressTracking = (startPct = 0) => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    setAudioProgress(startPct);
    
    const intervalMs = 200;
    const increment = (intervalMs / 1000 / Math.max(1, totalDurationSec)) * 100;

    progressInterval.current = setInterval(() => {
      setAudioProgress((prev) => {
        if (prev >= 99.5) {
          if (progressInterval.current) clearInterval(progressInterval.current);
          return 100;
        }
        return prev + increment;
      });
    }, intervalMs);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const speakFromOffset = (pctOffset: number, profileOverride?: VoiceProfile) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    const profile = profileOverride || activeProfile;
    window.speechSynthesis.cancel();

    const charOffset = Math.floor((pctOffset / 100) * fullTextToSpeak.length);
    const slicedText = fullTextToSpeak.slice(charOffset);

    if (!slicedText.trim()) {
      setIsPlaying(false);
      setAudioProgress(100);
      stopProgressTracking();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(slicedText);
    utterance.rate = Math.max(0.5, Math.min(2.5, rate * profile.rateMultiplier));
    utterance.pitch = Math.max(0.5, Math.min(2.0, profile.pitch));

    const matchedVoice = getMatchedSystemVoice(profile);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setAudioProgress(100);
      stopProgressTracking();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      stopProgressTracking();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    startProgressTracking(pctOffset);
  };

  // Robust Play/Pause Handler across all browsers
  const handlePlayPause = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      stopProgressTracking();
    } else {
      const startPct = audioProgress >= 99 ? 0 : audioProgress;
      speakFromOffset(startPct);
    }
  };

  // 5 Second Rewind Control (-5s)
  const handleSkipBack5 = () => {
    const deltaPct = (5 / Math.max(1, totalDurationSec)) * 100;
    const newPct = Math.max(0, audioProgress - deltaPct);
    setAudioProgress(newPct);
    if (isPlaying) {
      speakFromOffset(newPct);
    }
  };

  // 5 Second Fast Forward Control (+5s)
  const handleSkipForward5 = () => {
    const deltaPct = (5 / Math.max(1, totalDurationSec)) * 100;
    const newPct = Math.min(99, audioProgress + deltaPct);
    setAudioProgress(newPct);
    if (isPlaying) {
      speakFromOffset(newPct);
    }
  };

  const handleSpeedChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying) {
      speakFromOffset(audioProgress);
    }
  };

  const toggleGender = (newGender: 'male' | 'female') => {
    setGenderMode(newGender);
    const targetProfile = newGender === 'male' ? MALE_VOICE : FEMALE_VOICE;
    if (isPlaying) {
      speakFromOffset(audioProgress, targetProfile);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="w-full bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-4 md:px-6 md:py-5 flex flex-col gap-4 shadow-xs transition-all relative">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Playback Controls (-5s, Play/Pause, +5s) */}
        <div className="flex items-center gap-2">
          {/* Skip Back 5 Seconds (-5s) */}
          <button
            onClick={handleSkipBack5}
            className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title="Rewind 5 seconds"
            aria-label="Skip back 5 seconds"
          >
            <span className="text-[10px] font-mono font-bold flex items-center gap-0.5">
              <span>↺</span>5s
            </span>
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:opacity-90 transition-transform active:scale-95 shadow-md shrink-0 cursor-pointer"
            aria-label={isPlaying ? "Pause audio" : "Listen to issue"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          {/* Skip Forward 5 Seconds (+5s) */}
          <button
            onClick={handleSkipForward5}
            className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title="Fast forward 5 seconds"
            aria-label="Skip forward 5 seconds"
          >
            <span className="text-[10px] font-mono font-bold flex items-center gap-0.5">
              5s<span>↻</span>
            </span>
          </button>

          <div className="ml-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                Audio Briefing
              </span>
              {isPlaying && (
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-medium">
              {readingTimeMinutes} min • {activeProfile.label}
            </p>
          </div>
        </div>

        {/* Right Side Controls: Male/Female Segmented Toggle + Speed */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Segmented Male / Female Voice Toggle Switch */}
          <div className="flex items-center p-1 bg-[var(--bg)] border border-[var(--border-color)] rounded-xl shadow-2xs">
            <button
              onClick={() => toggleGender('male')}
              className={cn(
                "px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1",
                genderMode === 'male'
                  ? "bg-[var(--accent)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
              title="Switch to Male Voice"
            >
              <span>♂ Male</span>
            </button>
            <button
              onClick={() => toggleGender('female')}
              className={cn(
                "px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1",
                genderMode === 'female'
                  ? "bg-[var(--accent)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
              title="Switch to Female Voice"
            >
              <span>♀ Female</span>
            </button>
          </div>

          {/* Speed Controls (1x, 1.25x, 1.5x, 2x) */}
          <div className="flex items-center gap-1 bg-[var(--bg)] border border-[var(--border-color)] p-1 rounded-xl shadow-2xs">
            {[1, 1.25, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-colors cursor-pointer",
                  rate === s
                    ? "bg-[var(--accent)] text-white shadow-2xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Seek Bar */}
      <div 
        className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden border border-[var(--border-color)] relative group cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = Math.min(99.5, Math.max(0, (clickX / rect.width) * 100));
          setAudioProgress(pct);
          if (isPlaying) {
            speakFromOffset(pct);
          }
        }}
        title="Click to seek position"
      >
        <div
          className="h-full bg-[var(--accent)] transition-all duration-200 ease-linear rounded-full relative"
          style={{ width: `${audioProgress}%` }}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
