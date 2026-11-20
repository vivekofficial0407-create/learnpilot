/**
 * LearnPilot - Adaptive Learning Engine
 * Core pedagogical logic implementing Problem Statement PS04.
 *
 * All business logic is encapsulated here as pure functions for testability,
 * deterministic decision-making, and predictable UI state transitions.
 */

import {
  UserLevel,
  LearningStyle,
  AdaptiveAction,
  AdaptiveDecision,
  DiagnosticResult,
  QuizQuestion,
  UserProgressState,
} from '@/types';
import { ADAPTIVE_THRESHOLDS } from './constants';

/**
 * Evaluates the 4 diagnostic MCQs to determine the user's authentic proficiency level.
 * Compares detected level with self-reported level to inform the learner.
 *
 * Scoring logic:
 * - 0 - 1 correct: 'beginner'
 * - 2 correct: 'intermediate'
 * - 3 - 4 correct: 'advanced'
 *
 * @param answers Array of user selections with questionId and selectedIndex
 * @param questions Reference diagnostic questions
 * @param selfReportedLevel Level the user selected during onboarding
 */
export function evaluateDiagnosticResults(
  answers: { questionId: string; selectedIndex: number }[],
  questions: { id: string; correctIndex: number }[],
  selfReportedLevel: UserLevel
): DiagnosticResult {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedIndex]));
  let correctCount = 0;

  const evaluationDetails = questions.map((q) => {
    const selected = answerMap.get(q.id);
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      selectedIndex: selected ?? -1,
      isCorrect,
    };
  });

  const percentage = Math.round((correctCount / Math.max(questions.length, 1)) * 100);

  let detectedLevel: UserLevel = 'beginner';
  if (correctCount >= 3) {
    detectedLevel = 'advanced';
  } else if (correctCount === 2) {
    detectedLevel = 'intermediate';
  } else {
    detectedLevel = 'beginner';
  }

  let feedback = '';
  if (detectedLevel === selfReportedLevel) {
    feedback = `Your diagnostic score confirmed your self-reported ${selfReportedLevel} level (${correctCount}/${questions.length} correct). We tailored your learning pace accordingly!`;
  } else if (
    (selfReportedLevel === 'beginner' && detectedLevel !== 'beginner') ||
    (selfReportedLevel === 'intermediate' && detectedLevel === 'advanced')
  ) {
    feedback = `Impressive! You answered ${correctCount}/${questions.length} correctly. Your actual level is higher than self-reported (${detectedLevel.toUpperCase()}). We increased baseline module depth.`;
  } else {
    feedback = `Diagnostic assessment indicates foundational gaps (${correctCount}/${questions.length} correct). We calibrated your curriculum to ${detectedLevel.toUpperCase()} to ensure solid fundamentals before advanced topics.`;
  }

  return {
    score: correctCount,
    percentage,
    detectedLevel,
    feedback,
    answers: evaluationDetails,
  };
}

/**
 * Calculates quiz results and isolates weak concept tags.
 *
 * @param userAnswers User's selected index for each question
 * @param questions The quiz questions
 */
export function evaluateQuizSubmission(
  userAnswers: { questionId: string; selectedIndex: number }[],
  questions: QuizQuestion[]
): {
  score: number;
  percentage: number;
  failedConceptTags: string[];
  detailedResults: {
    questionId: string;
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
    conceptTag: string;
    explanation: string;
  }[];
} {
  const answerMap = new Map(userAnswers.map((a) => [a.questionId, a.selectedIndex]));
  let score = 0;
  const failedConceptTags: string[] = [];

  const detailedResults = questions.map((q) => {
    const selected = answerMap.get(q.id) ?? -1;
    const isCorrect = selected === q.correctIndex;

    if (isCorrect) {
      score++;
    } else {
      if (q.conceptTag && !failedConceptTags.includes(q.conceptTag)) {
        failedConceptTags.push(q.conceptTag);
      }
    }

    return {
      questionId: q.id,
      selectedIndex: selected,
      correctIndex: q.correctIndex,
      isCorrect,
      conceptTag: q.conceptTag,
      explanation: q.explanation,
    };
  });

  const percentage = Math.round((score / Math.max(questions.length, 1)) * 100);

  return {
    score,
    percentage,
    failedConceptTags,
    detailedResults,
  };
}

/**
 * Core Adaptive Decision Engine (PS04)
 *
 * Decision rules:
 * 1. Score < 60%:
 *    - Action: REVISE
 *    - Re-explain more simply with fresh beginner analogies and examples
 *    - Flag weak topics
 * 2. Score 60% - 85%:
 *    - Action: CONTINUE
 *    - Clear to proceed to next module with minor reinforcement
 * 3. Score > 85%:
 *    - Action: ADVANCE
 *    - Mastery unlocked; raise module complexity or recommend skipping forward
 *
 * @param moduleId Current module identifier
 * @param percentage Percentage score achieved on quiz (0..100)
 * @param failedConceptTags Concept tags missed during the quiz
 * @param currentLevel User's current learning level
 * @param learningStyle User's preferred learning style
 */
export function makeAdaptiveDecision(
  moduleId: string,
  percentage: number,
  failedConceptTags: string[],
  currentLevel: UserLevel,
  learningStyle: LearningStyle
): AdaptiveDecision {
  const now = new Date().toISOString();

  // 1. Revision Branch (< 60%)
  if (percentage <= ADAPTIVE_THRESHOLDS.REVISE_UPPER_BOUND) {
    const weakTopicsText =
      failedConceptTags.length > 0
        ? `Concepts needing review: ${failedConceptTags.join(', ')}.`
        : 'Foundational concepts were missed.';

    return {
      moduleId,
      score: percentage,
      percentage,
      action: 'REVISE',
      badgeText: 'Review & Reinforce Required',
      primaryReason: `Quiz score was ${percentage}% (threshold: 60%). The agent detected comprehension gaps in core mechanics. ${weakTopicsText}`,
      recommendations: [
        'Review the simplified breakdown below before retrying the quiz.',
        'Focus on the targeted examples addressing your missed concept tags.',
        'Use the built-in AI Tutor to ask questions on difficult points.',
      ],
      simplifiedSummary: `Let's break this down into bite-sized analogies. Rather than memorizing formulas, think of this module as a sequence of input-output steps. Review the core rules and retry when ready!`,
      identifiedWeakTopics: [...failedConceptTags],
      timestamp: now,
    };
  }

  // 2. Normal Progression Branch (60% - 85%)
  if (
    percentage >= ADAPTIVE_THRESHOLDS.CONTINUE_LOWER_BOUND &&
    percentage <= ADAPTIVE_THRESHOLDS.CONTINUE_UPPER_BOUND
  ) {
    const advice =
      learningStyle === 'exam-focused'
        ? 'Solid performance. Make note of edge cases for exam readiness.'
        : 'Great steady progress! You have achieved sufficient mastery to proceed.';

    return {
      moduleId,
      score: percentage,
      percentage,
      action: 'CONTINUE',
      badgeText: 'Competency Achieved - Proceed',
      primaryReason: `Quiz score of ${percentage}% meets the target mastery threshold (60%-85%). Ready to unlock the next scheduled module.`,
      recommendations: [
        'Proceed to the next module in your roadmap.',
        failedConceptTags.length > 0
          ? `Optionally review: ${failedConceptTags.join(', ')} in the summary notes.`
          : 'Keep up the consistent study pace!',
      ],
      identifiedWeakTopics: [...failedConceptTags],
      timestamp: now,
    };
  }

  // 3. Accelerated Mastery Branch (> 85%)
  const accelerationNote =
    currentLevel === 'beginner'
      ? 'Exceptional mastery! Raising next module difficulty towards intermediate depth.'
      : 'Outstanding performance! You grasped nuances rapidly. Ready for advanced challenge content.';

  return {
    moduleId,
    score: percentage,
    percentage,
    action: 'ADVANCE',
    badgeText: 'High Mastery - Accelerated',
    primaryReason: `Outstanding score of ${percentage}% (exceeds 85% acceleration threshold). The agent has unlocked fast-track progression.`,
    recommendations: [
      accelerationNote,
      'You have the option to skip intermediate recaps and jump straight to higher-order challenges.',
      'Check the module dashboard for bonus extension questions.',
    ],
    identifiedWeakTopics: [],
    timestamp: now,
  };
}

/**
 * Calculates the updated study streak based on last active date string.
 *
 * @param lastActiveDateStr ISO or YYYY-MM-DD date string
 * @param currentStreak Existing streak days
 * @param todayDateStr Today's YYYY-MM-DD date
 */
export function calculateStreak(
  lastActiveDateStr: string,
  currentStreak: number,
  todayDateStr: string = new Date().toISOString().split('T')[0]
): { newStreak: number; updatedDate: string } {
  if (!lastActiveDateStr) {
    return { newStreak: 1, updatedDate: todayDateStr };
  }

  const lastDate = new Date(lastActiveDateStr.split('T')[0]);
  const today = new Date(todayDateStr);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already studied today
    return { newStreak: Math.max(currentStreak, 1), updatedDate: todayDateStr };
  } else if (diffDays === 1) {
    // Studied yesterday, streak increments!
    return { newStreak: currentStreak + 1, updatedDate: todayDateStr };
  } else {
    // Streak broken
    return { newStreak: 1, updatedDate: todayDateStr };
  }
}

/**
 * Aggregates weak topics from failed quizzes
 */
export function aggregateWeakTopics(
  currentWeakTopics: UserProgressState['weakTopics'],
  newFailedTags: string[],
  moduleId: string
): UserProgressState['weakTopics'] {
  const topicMap = new Map<string, { failureCount: number; lastFailedModuleId: string }>();

  for (const item of currentWeakTopics) {
    topicMap.set(item.topic, {
      failureCount: item.failureCount,
      lastFailedModuleId: item.lastFailedModuleId,
    });
  }

  for (const tag of newFailedTags) {
    const existing = topicMap.get(tag);
    if (existing) {
      topicMap.set(tag, {
        failureCount: existing.failureCount + 1,
        lastFailedModuleId: moduleId,
      });
    } else {
      topicMap.set(tag, {
        failureCount: 1,
        lastFailedModuleId: moduleId,
      });
    }
  }

  return Array.from(topicMap.entries()).map(([topic, data]) => ({
    topic,
    failureCount: data.failureCount,
    lastFailedModuleId: data.lastFailedModuleId,
  }));
}
