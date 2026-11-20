'use client';

import React from 'react';
import { Roadmap, ModuleRoadmapItem, UserProfile } from '@/types';
import { PDFExportButton } from './PDFExportButton';
import {
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Award,
} from 'lucide-react';

interface RoadmapViewProps {
  roadmap: Roadmap;
  profile: UserProfile;
  onSelectModule: (module: ModuleRoadmapItem) => void;
  onViewDashboard: () => void;
}

export function RoadmapView({
  roadmap,
  profile,
  onSelectModule,
  onViewDashboard,
}: RoadmapViewProps) {
  const completedCount = roadmap.modules.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / roadmap.modules.length) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Personalized Study Plan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {roadmap.topic}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Calibrated for <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{roadmap.targetLevel}</span> • Style:{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{roadmap.style}</span> • Total Duration:{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">~{roadmap.totalEstimatedMinutes} mins</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PDFExportButton roadmap={roadmap} profile={profile} />
            <button
              type="button"
              onClick={onViewDashboard}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <Award className="w-4 h-4" aria-hidden="true" />
              <span>View Dashboard</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
            <span>Course Completion: {completedCount} of {roadmap.modules.length} Modules</span>
            <span className="text-brand-600 dark:text-brand-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-accent-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Course Completion Progress"
            />
          </div>
        </div>
      </div>

      {/* Modules Stepper List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white px-1">
          Curriculum Sequence ({roadmap.modules.length} Modules)
        </h2>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {roadmap.modules.map((mod, index) => {
            const isCompleted = mod.status === 'completed';
            const isInProgress = mod.status === 'in-progress';
            const isLocked = mod.status === 'locked';
            const needsReview = mod.status === 'needs-review';

            return (
              <div key={mod.id} className="relative group">
                {/* Timeline Node Icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all bg-white dark:bg-slate-900 ${
                    isCompleted
                      ? 'border-emerald-500 text-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950/40'
                      : isInProgress
                      ? 'border-brand-600 text-brand-600 ring-4 ring-brand-50 dark:ring-brand-950/40 animate-pulse'
                      : needsReview
                      ? 'border-amber-500 text-amber-500 ring-4 ring-amber-50 dark:ring-amber-950/40'
                      : 'border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                  ) : isInProgress ? (
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
                  ) : needsReview ? (
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                  )}
                </div>

                {/* Module Card */}
                <div
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    isInProgress
                      ? 'bg-white dark:bg-slate-900 border-brand-400 dark:border-brand-600 shadow-md ring-1 ring-brand-400/30'
                      : isCompleted
                      ? 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'
                      : needsReview
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                      : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Module {index + 1}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold capitalize ${
                          mod.difficulty === 'beginner'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : mod.difficulty === 'intermediate'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {mod.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{mod.estimatedMinutes} mins</span>
                      </span>
                    </div>

                    {/* Quiz Score Badge if completed */}
                    {mod.quizScore !== null && (
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          mod.quizScore >= 85
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : mod.quizScore >= 60
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        Quiz Score: {mod.quizScore}%
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {mod.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mod.description}
                  </p>

                  {/* Learning Objectives Pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1">
                      Key Concepts:
                    </span>
                    {mod.keyConcepts.map((concept) => (
                      <span
                        key={concept}
                        className="px-2 py-0.5 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>

                  {/* Action CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {isCompleted
                        ? 'Mastered • Click to review or retake quiz'
                        : isInProgress
                        ? 'Current Active Milestone'
                        : needsReview
                        ? 'Agent recommends revision (<60%)'
                        : 'Unlocks upon completing prior module'}
                    </div>

                    {!isLocked ? (
                      <button
                        type="button"
                        onClick={() => onSelectModule(mod)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                          isInProgress || needsReview
                            ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span>{isCompleted ? 'Review Module' : isInProgress ? 'Enter Module' : 'Open'}</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
