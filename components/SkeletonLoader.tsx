'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface SkeletonLoaderProps {
  label?: string;
  variant?: 'card' | 'module' | 'quiz' | 'roadmap';
}

export function SkeletonLoader({
  label = 'Agent is synthesizing personalized pedagogical content...',
  variant = 'card',
}: SkeletonLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full my-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse transition-all"
    >
      <div className="flex items-center gap-3 mb-6">
        <Loader2 className="w-6 h-6 text-brand-600 dark:text-brand-400 animate-spin" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </span>
      </div>

      {variant === 'card' && (
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
        </div>
      )}

      {variant === 'roadmap' && (
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3 mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
              </div>
              <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
            </div>
          ))}
        </div>
      )}

      {variant === 'module' && (
        <div className="space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-11/12" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
          </div>
          <div className="h-36 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-700/60 rounded w-3/4" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-700/60 rounded w-2/3" />
          </div>
        </div>
      )}

      {variant === 'quiz' && (
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"
              />
            ))}
          </div>
        </div>
      )}

      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
