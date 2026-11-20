'use client';

import React from 'react';
import { Sparkles, Flame, Sun, Moon, RotateCcw, BookOpen } from 'lucide-react';

interface HeaderProps {
  streakDays: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLoadDemo: () => void;
  onReset: () => void;
  hasActiveCourse: boolean;
}

export function Header({
  streakDays,
  isDarkMode,
  onToggleTheme,
  onLoadDemo,
  onReset,
  hasActiveCourse,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-600 text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Learn<span className="text-brand-600 dark:text-brand-400">Pilot</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                AI Agent PS04
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Adaptive Personalized Learning Engine
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Streak Counter */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 font-semibold text-sm shadow-sm"
            title={`${streakDays} day study streak!`}
            aria-label={`Study streak: ${streakDays} days`}
          >
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-bold">{streakDays}</span>
            <span className="hidden sm:inline text-xs font-medium">day streak</span>
          </div>

          {/* Try Demo Button */}
          <button
            type="button"
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-600 to-brand-600 hover:from-accent-700 hover:to-brand-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 active:scale-95"
            aria-label="Load hardcoded offline demo course"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>Try Demo</span>
          </button>

          {/* Reset Course if active */}
          {hasActiveCourse && (
            <button
              type="button"
              onClick={onReset}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              title="Reset current course and start new topic"
              aria-label="Reset and start new topic"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
