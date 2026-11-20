import { describe, it, expect } from 'vitest';
import {
  evaluateDiagnosticResults,
  evaluateQuizSubmission,
  makeAdaptiveDecision,
  calculateStreak,
  aggregateWeakTopics,
} from '@/lib/adaptive-engine';
import { QuizQuestion } from '@/types';

describe('Adaptive Engine Unit Tests (PS04)', () => {
  describe('evaluateDiagnosticResults', () => {
    const mockQuestions = [
      { id: 'q1', correctIndex: 0 },
      { id: 'q2', correctIndex: 1 },
      { id: 'q3', correctIndex: 2 },
      { id: 'q4', correctIndex: 3 },
    ];

    it('detects beginner level when score is 0 or 1', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 }, // 1 correct
        { questionId: 'q2', selectedIndex: 0 },
        { questionId: 'q3', selectedIndex: 0 },
        { questionId: 'q4', selectedIndex: 0 },
      ];
      const result = evaluateDiagnosticResults(answers, mockQuestions, 'intermediate');
      expect(result.score).toBe(1);
      expect(result.detectedLevel).toBe('beginner');
      expect(result.percentage).toBe(25);
    });

    it('detects intermediate level when score is exactly 2', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 },
        { questionId: 'q2', selectedIndex: 1 },
        { questionId: 'q3', selectedIndex: 0 },
        { questionId: 'q4', selectedIndex: 0 },
      ];
      const result = evaluateDiagnosticResults(answers, mockQuestions, 'intermediate');
      expect(result.score).toBe(2);
      expect(result.detectedLevel).toBe('intermediate');
      expect(result.percentage).toBe(50);
    });

    it('detects advanced level when score is 3 or 4', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 },
        { questionId: 'q2', selectedIndex: 1 },
        { questionId: 'q3', selectedIndex: 2 },
        { questionId: 'q4', selectedIndex: 3 },
      ];
      const result = evaluateDiagnosticResults(answers, mockQuestions, 'beginner');
      expect(result.score).toBe(4);
      expect(result.detectedLevel).toBe('advanced');
      expect(result.percentage).toBe(100);
      expect(result.feedback).toContain('higher than self-reported');
    });
  });

  describe('evaluateQuizSubmission', () => {
    const sampleQuestions: QuizQuestion[] = [
      {
        id: 'q1',
        moduleId: 'm1',
        question: 'Q1',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 1,
        explanation: 'Exp 1',
        conceptTag: 'Event Loop',
      },
      {
        id: 'q2',
        moduleId: 'm1',
        question: 'Q2',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 2,
        explanation: 'Exp 2',
        conceptTag: 'Microtasks',
      },
      {
        id: 'q3',
        moduleId: 'm1',
        question: 'Q3',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        explanation: 'Exp 3',
        conceptTag: 'Promises',
      },
      {
        id: 'q4',
        moduleId: 'm1',
        question: 'Q4',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 3,
        explanation: 'Exp 4',
        conceptTag: 'AbortController',
      },
      {
        id: 'q5',
        moduleId: 'm1',
        question: 'Q5',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 1,
        explanation: 'Exp 5',
        conceptTag: 'Concurrency Limits',
      },
    ];

    it('calculates 100% score and empty failed tags', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 1 },
        { questionId: 'q2', selectedIndex: 2 },
        { questionId: 'q3', selectedIndex: 0 },
        { questionId: 'q4', selectedIndex: 3 },
        { questionId: 'q5', selectedIndex: 1 },
      ];
      const res = evaluateQuizSubmission(answers, sampleQuestions);
      expect(res.score).toBe(5);
      expect(res.percentage).toBe(100);
      expect(res.failedConceptTags).toHaveLength(0);
    });

    it('isolates failed concept tags correctly on wrong answers', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 }, // wrong, tag: Event Loop
        { questionId: 'q2', selectedIndex: 2 },
        { questionId: 'q3', selectedIndex: 1 }, // wrong, tag: Promises
        { questionId: 'q4', selectedIndex: 3 },
        { questionId: 'q5', selectedIndex: 1 },
      ];
      const res = evaluateQuizSubmission(answers, sampleQuestions);
      expect(res.score).toBe(3);
      expect(res.percentage).toBe(60);
      expect(res.failedConceptTags).toContain('Event Loop');
      expect(res.failedConceptTags).toContain('Promises');
    });
  });

  describe('makeAdaptiveDecision (PS04 Thresholds)', () => {
    it('triggers REVISE when score is strictly below 60%', () => {
      const decision = makeAdaptiveDecision(
        'mod-1',
        40,
        ['Race Conditions', 'Mutex'],
        'intermediate',
        'example-heavy'
      );
      expect(decision.action).toBe('REVISE');
      expect(decision.badgeText).toContain('Review');
      expect(decision.simplifiedSummary).toBeDefined();
      expect(decision.identifiedWeakTopics).toEqual(['Race Conditions', 'Mutex']);
    });

    it('triggers CONTINUE when score is between 60% and 85%', () => {
      const decision60 = makeAdaptiveDecision(
        'mod-1',
        60,
        ['Microtasks'],
        'intermediate',
        'example-heavy'
      );
      expect(decision60.action).toBe('CONTINUE');
      expect(decision60.badgeText).toContain('Competency');

      const decision80 = makeAdaptiveDecision(
        'mod-1',
        80,
        [],
        'intermediate',
        'simple'
      );
      expect(decision80.action).toBe('CONTINUE');
    });

    it('triggers ADVANCE when score exceeds 85%', () => {
      const decision86 = makeAdaptiveDecision(
        'mod-1',
        86,
        [],
        'beginner',
        'exam-focused'
      );
      expect(decision86.action).toBe('ADVANCE');
      expect(decision86.badgeText).toContain('Accelerated');
      expect(decision86.recommendations.some((r) => r.includes('Raising next module'))).toBe(true);

      const decision100 = makeAdaptiveDecision(
        'mod-1',
        100,
        [],
        'advanced',
        'example-heavy'
      );
      expect(decision100.action).toBe('ADVANCE');
    });
  });

  describe('calculateStreak', () => {
    it('initializes streak to 1 when no previous active date', () => {
      const { newStreak } = calculateStreak('', 0, '2026-11-20');
      expect(newStreak).toBe(1);
    });

    it('maintains streak when studied again on the same day', () => {
      const { newStreak } = calculateStreak('2026-11-20', 3, '2026-11-20');
      expect(newStreak).toBe(3);
    });

    it('increments streak by 1 when studied on the consecutive next day', () => {
      const { newStreak } = calculateStreak('2026-11-19', 3, '2026-11-20');
      expect(newStreak).toBe(4);
    });

    it('resets streak to 1 when a gap of 2 or more days occurred', () => {
      const { newStreak } = calculateStreak('2026-11-15', 5, '2026-11-20');
      expect(newStreak).toBe(1);
    });
  });

  describe('aggregateWeakTopics', () => {
    it('aggregates new failed topics and increments failure count', () => {
      const existing = [
        { topic: 'Event Loop', failureCount: 1, lastFailedModuleId: 'mod-1' },
      ];
      const updated = aggregateWeakTopics(existing, ['Event Loop', 'Mutex'], 'mod-2');

      const eventLoop = updated.find((t) => t.topic === 'Event Loop');
      expect(eventLoop?.failureCount).toBe(2);
      expect(eventLoop?.lastFailedModuleId).toBe('mod-2');

      const mutex = updated.find((t) => t.topic === 'Mutex');
      expect(mutex?.failureCount).toBe(1);
      expect(mutex?.lastFailedModuleId).toBe('mod-2');
    });
  });
});
