'use client';

import React, { useState } from 'react';
import { QuizQuestion, ModuleRoadmapItem } from '@/types';
import { evaluateQuizSubmission } from '@/lib/adaptive-engine';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';

interface QuizViewProps {
  module: ModuleRoadmapItem;
  questions: QuizQuestion[];
  onSubmitQuiz: (results: {
    score: number;
    percentage: number;
    failedConceptTags: string[];
    userAnswers: { questionId: string; selectedIndex: number }[];
  }) => void;
  onCancel: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function QuizView({
  module,
  questions,
  onSubmitQuiz,
  onCancel,
}: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluatedResult, setEvaluatedResult] = useState<ReturnType<
    typeof evaluateQuizSubmission
  > | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isCurrentAnswered = selectedAnswers[currentQuestion?.id] !== undefined;
  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: index,
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

  const handleSubmit = () => {
    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: selectedAnswers[q.id] ?? -1,
    }));

    const result = evaluateQuizSubmission(formattedAnswers, questions);
    setEvaluatedResult(result);
    setIsSubmitted(true);
  };

  const handleProceedToDecision = () => {
    if (!evaluatedResult) return;
    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: selectedAnswers[q.id] ?? -1,
    }));

    onSubmitQuiz({
      score: evaluatedResult.score,
      percentage: evaluatedResult.percentage,
      failedConceptTags: evaluatedResult.failedConceptTags,
      userAnswers: formattedAnswers,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl transition-all animate-fadeIn">
      {/* Quiz Header */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Module {module.order} Quiz Evaluation</span>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1"
          >
            Exit Quiz
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {module.title}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          5 questions testing key concepts. Score triggers automatic adaptation (PS04: &lt;60% Revise, 60-85% Continue, &gt;85% Advance).
        </p>

        {/* Stepper Progress */}
        <div className="mt-4 flex items-center gap-1.5 sm:gap-2">
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
                aria-label={`Jump to question ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {!isSubmitted ? (
        /* Question View */
        <div>
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Concept: {currentQuestion.conceptTag}
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
                      name={`quiz-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() => handleSelectOption(optIdx)}
                      className="sr-only"
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

          {/* Controls */}
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
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-md shadow-brand-500/20 disabled:opacity-40 transition-all"
              >
                <span>Submit Quiz for Agent Evaluation</span>
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
        /* Submission Review & Reveal Results */
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border ${
              (evaluatedResult?.percentage ?? 0) >= 85
                ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800'
                : (evaluatedResult?.percentage ?? 0) >= 60
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-700 dark:text-slate-300">
                Quiz Evaluation Completed
              </span>
              <span className="text-xl font-black">
                {evaluatedResult?.score} / {questions.length} Correct ({evaluatedResult?.percentage}%)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {(evaluatedResult?.percentage ?? 0) < 60
                ? 'Comprehension score is below 60%. The agent will construct a simplified review session with new examples.'
                : (evaluatedResult?.percentage ?? 0) <= 85
                ? 'Great work! Score is within the target progression threshold (60-85%). You are clear to proceed.'
                : 'Mastery unlocked! Score exceeds 85%. The agent will advance module complexity.'}
            </p>
          </div>

          {/* Question Explanations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Question-by-Question Review:
            </h4>
            {evaluatedResult?.detailedResults.map((item, idx) => (
              <div
                key={item.questionId}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    )}
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Q{idx + 1}: {questions[idx].question}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      item.isCorrect
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                    }`}
                  >
                    {item.isCorrect ? 'Correct' : 'Needs Review'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 pl-7 space-y-1">
                  <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Concept:
                    </span>{' '}
                    {item.conceptTag}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Explanation:
                    </span>{' '}
                    {item.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Trigger Adaptive Decision CTA */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleProceedToDecision}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-lg shadow-brand-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <span>View Agent Decision & Next Step</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
