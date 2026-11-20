'use client';

import React from 'react';
import { UserProgressState, Roadmap, UserProfile } from '@/types';
import {
  Flame,
  Award,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgressState;
  roadmap: Roadmap;
  profile: UserProfile;
  onBackToRoadmap: () => void;
}

export function ProgressDashboard({
  progress,
  roadmap,
  profile,
  onBackToRoadmap,
}: ProgressDashboardProps) {
  const completedCount = roadmap.modules.filter((m) => m.status === 'completed').length;
  const totalModules = roadmap.modules.length;
  const overallMastery = Math.round((completedCount / Math.max(totalModules, 1)) * 100);

  // Compute average quiz score across completed modules
  const scores = Object.values(progress.moduleScores);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Back to Roadmap Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToRoadmap}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Course Roadmap</span>
        </button>

        <span className="text-xs text-slate-400">
          Last Active: {progress.lastActiveDate}
        </span>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Counter */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-500 flex-shrink-0">
            <Flame className="w-6 h-6 animate-bounce" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Study Streak
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {progress.streakDays} <span className="text-xs font-semibold text-slate-500">days</span>
            </div>
          </div>
        </div>

        {/* Course Completion */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 flex items-center justify-center text-brand-600 flex-shrink-0">
            <Award className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Curriculum Mastery
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {overallMastery}%
            </div>
          </div>
        </div>

        {/* Avg Quiz Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Target className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg Quiz Score
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {avgScore > 0 ? `${avgScore}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Clock className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Time Investment
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              ~{roadmap.totalEstimatedMinutes} <span className="text-xs font-semibold text-slate-500">mins</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Module-by-Module Mastery Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Module Mastery Breakdown
            </h3>
            <span className="text-xs text-slate-500">
              {completedCount}/{totalModules} Completed
            </span>
          </div>

          <div className="space-y-3">
            {roadmap.modules.map((mod, idx) => {
              const score = progress.moduleScores[mod.id] ?? mod.quizScore ?? 0;
              const isDone = mod.status === 'completed';

              return (
                <div
                  key={mod.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <span className="truncate pr-2">
                      M{idx + 1}: {mod.title}
                    </span>
                    <span
                      className={`font-bold flex-shrink-0 ${
                        score >= 85
                          ? 'text-purple-600 dark:text-purple-400'
                          : score >= 60
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : score > 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {score > 0 ? `${score}%` : isDone ? 'Done' : 'Not started'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        score >= 85
                          ? 'bg-purple-600'
                          : score >= 60
                          ? 'bg-emerald-600'
                          : score > 0
                          ? 'bg-rose-500'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      style={{ width: `${Math.max(score, isDone ? 100 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Topics Diagnostic Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Weak Topics & Attention Areas
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automatically populated whenever a quiz question is missed. The agent emphasizes these concepts in subsequent review cycles.
          </p>

          {progress.weakTopics.length > 0 ? (
            <div className="space-y-3 pt-2">
              {progress.weakTopics.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.topic}
                    </span>
                    <span className="block text-[11px] text-amber-700 dark:text-amber-400">
                      Needs review • Flagged in {item.lastFailedModuleId}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    {item.failureCount}x missed
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Weak Topics Flagged!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You have demonstrated solid mastery across all attempted quizzes. Keep up the high retention!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Adaptive Decision History Log */}
      {progress.adaptiveDecisions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Agent Decision History Log (PS04 Auditing)
            </h3>
          </div>

          <div className="space-y-3">
            {progress.adaptiveDecisions.map((dec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        dec.action === 'REVISE'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : dec.action === 'CONTINUE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}
                    >
                      {dec.action} ({dec.percentage}%)
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Module: {dec.moduleId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {dec.primaryReason}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {new Date(dec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
