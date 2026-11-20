'use client';

import React, { useState } from 'react';
import { DiagnosticQuestion, DiagnosticResult, UserLevel } from '@/types';
import { evaluateDiagnosticResults } from '@/lib/adaptive-engine';
import { CheckCircle2, XCircle, ArrowRight, Brain, AlertTriangle, Sparkles } from 'lucide-react';

interface DiagnosticAssessmentProps {
  topic: string;
  selfReportedLevel: UserLevel;
  questions: DiagnosticQuestion[];
  onComplete: (result: DiagnosticResult) => void;
  isPlanningRoadmap: boolean;
}

export function DiagnosticAssessment({
  topic,
  selfReportedLevel,
  questions,
  onComplete,
  isPlanningRoadmap,
}: DiagnosticAssessmentProps) {
  // Current active question index (0..3)
  const [currentIndex, setCurrentIndex] = useState(0);
  // User answers map: questionId -> selectedIndex
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  // Once submitted, show results summary
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isCurrentAnswered = selectedAnswers[currentQuestion?.id] !== undefined;
  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSelectOption = (optionIndex: number) => {
    if (result) return; // Locked once finalized
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleEvaluate = () => {
    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: selectedAnswers[q.id] ?? -1,
    }));

    const evaluated = evaluateDiagnosticResults(
      formattedAnswers,
      questions.map((q) => ({ id: q.id, correctIndex: q.correctIndex })),
      selfReportedLevel
    );

    setResult(evaluated);
  };

  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
      {/* Step Header */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Diagnostic Assessment (PS04)</span>
          </div>

          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Self-Reported: <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{selfReportedLevel}</span>
          </div>
        </div>

        <h2 className="mt-3 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Diagnosing baseline knowledge in <span className="text-brand-600 dark:text-brand-400">{topic}</span>
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Answer these 4 diagnostic questions. The agent analyzes your responses to calibrate module difficulty.
        </p>

        {/* Question Stepper Indicator */}
        <div className="mt-4 flex items-center gap-2">
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`flex-1 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  isCurrent
                    ? 'bg-brand-600 ring-2 ring-brand-400 ring-offset-1 dark:ring-offset-slate-900'
                    : isAnswered
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
                aria-label={`Jump to question ${idx + 1}${isAnswered ? ' (Answered)' : ''}`}
              />
            );
          })}
        </div>
      </div>

      {!result ? (
        /* Question Answering View */
        <div>
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
              Target Level: {currentQuestion.difficultyLevel}
            </span>
          </div>

          <fieldset className="space-y-4">
            <legend className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug mb-4">
              {currentQuestion.question}
            </legend>

            <div className="space-y-3">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;

                return (
                  <label
                    key={optIdx}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 ring-2 ring-brand-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`diag-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() => handleSelectOption(optIdx)}
                      className="sr-only"
                      aria-label={`Option ${OPTION_LETTERS[optIdx]}: ${option}`}
                    />
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {OPTION_LETTERS[optIdx]}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-normal">
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!allAnswered}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-brand-600 hover:from-emerald-700 hover:to-brand-700 shadow-md shadow-emerald-500/20 disabled:opacity-40 transition-all"
              >
                <span>Evaluate & Reveal Calibration</span>
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-40 transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Evaluation Result Summary */
        <div className="space-y-6 animate-fadeIn">
          <div
            className={`p-6 rounded-2xl border ${
              result.detectedLevel === selfReportedLevel
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                <Brain className="w-6 h-6 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-brand-600 dark:text-brand-400">
                  Agent Calibration Complete
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Detected Level: {result.detectedLevel.toUpperCase()} ({result.score}/4 Correct)
                </h3>
              </div>
            </div>

            <p className="text-sm font-medium leading-relaxed">{result.feedback}</p>
          </div>

          {/* Diagnostic Review Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Question Breakdown & Rationale:
            </h4>
            {questions.map((q, idx) => {
              const answer = result.answers.find((a) => a.questionId === q.id);
              const isCorrect = answer?.isCorrect;

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                      )}
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Q{idx + 1}: {q.question}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                      }`}
                    >
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 pl-7">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Explanation:</span>{' '}
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Proceed to Roadmap Generation Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onComplete(result)}
              disabled={isPlanningRoadmap}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-md shadow-brand-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            >
              <span>{isPlanningRoadmap ? 'Synthesizing 5-7 Module Curriculum...' : 'Generate Personalized Roadmap'}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
