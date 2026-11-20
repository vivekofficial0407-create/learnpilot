'use client';

import React from 'react';
import { AdaptiveDecision, ModuleRoadmapItem } from '@/types';
import {
  Sparkles,
  Bot,
  ArrowRight,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface AgentDecisionPanelProps {
  decision: AdaptiveDecision;
  module: ModuleRoadmapItem;
  onRetryQuiz: () => void;
  onReviewSimplified: () => void;
  onContinueNext: () => void;
  hasNextModule: boolean;
}

export function AgentDecisionPanel({
  decision,
  module,
  onRetryQuiz,
  onReviewSimplified,
  onContinueNext,
  hasNextModule,
}: AgentDecisionPanelProps) {
  const isRevise = decision.action === 'REVISE';
  const isContinue = decision.action === 'CONTINUE';
  const isAdvance = decision.action === 'ADVANCE';

  return (
    <section
      role="region"
      aria-live="polite"
      className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn"
      aria-label="AI Agent Pedagogical Decision"
    >
      {/* Prominent Agent Identity Card */}
      <div
        className={`rounded-3xl p-6 sm:p-10 border shadow-2xl relative overflow-hidden transition-all ${
          isRevise
            ? 'bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/30 dark:to-slate-900 border-rose-300 dark:border-rose-800'
            : isContinue
            ? 'bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900 border-emerald-300 dark:border-emerald-800'
            : 'bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-900 border-purple-300 dark:border-purple-800'
        }`}
      >
        {/* Glow Accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-brand-500/10 to-accent-500/20 blur-2xl pointer-events-none" />

        {/* Top Agent Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                isRevise
                  ? 'bg-gradient-to-tr from-rose-600 to-amber-600 shadow-rose-500/25'
                  : isContinue
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-500/25'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/25'
              }`}
            >
              <Bot className="w-6 h-6 animate-bounce" aria-hidden="true" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Visible Agent Decision (PS04)
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Sparkles className="w-3 h-3 text-brand-500" />
                  Real-time Adaptive Logic
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                Evaluation for: {module.title}
              </h2>
            </div>
          </div>

          {/* Action Badge */}
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black border ${
                isRevise
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                  : isContinue
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                  : 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700'
              }`}
            >
              {isRevise ? (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              ) : isContinue ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Zap className="w-4 h-4 text-purple-600" />
              )}
              <span>{decision.badgeText}</span>
            </span>
          </div>
        </div>

        {/* Quantitative Score & Reasoning */}
        <div className="py-6 space-y-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {decision.percentage}%
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Quiz Score Achieved
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              (Evaluated against criteria: &lt;60% Revise | 60-85% Continue | &gt;85% Accelerate)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Primary Agent Rationale:
            </h3>
            <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {decision.primaryReason}
            </p>
          </div>

          {/* Identified Weak Topics if any */}
          {decision.identifiedWeakTopics.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Identified Knowledge Gaps (Added to Weak Topics Tracker):</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {decision.identifiedWeakTopics.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Simplified Re-Explanation Summary if REVISE */}
          {decision.simplifiedSummary && isRevise && (
            <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200 text-sm">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Agent Simplified Breakdown & Intuition Booster:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {decision.simplifiedSummary}
              </p>
            </div>
          )}

          {/* Recommendations List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Agent Recommended Next Steps:
            </h3>
            <ul className="space-y-1.5">
              {decision.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          {isRevise && (
            <>
              <button
                type="button"
                onClick={onReviewSimplified}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>Review Simplified Notes</span>
              </button>
              <button
                type="button"
                onClick={onRetryQuiz}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-md shadow-rose-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Retry Module Quiz</span>
              </button>
            </>
          )}

          {(isContinue || isAdvance) && (
            <>
              <button
                type="button"
                onClick={onRetryQuiz}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Retake Quiz (Optional)</span>
              </button>

              <button
                type="button"
                onClick={onContinueNext}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all focus:outline-none focus:ring-2 ${
                  isAdvance
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500 shadow-purple-500/25'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:ring-emerald-500 shadow-emerald-500/25'
                }`}
              >
                <span>
                  {hasNextModule
                    ? isAdvance
                      ? 'Advance to Next Module (Accelerated)'
                      : 'Continue to Next Milestone'
                    : 'View Course Mastery Dashboard'}
                </span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
