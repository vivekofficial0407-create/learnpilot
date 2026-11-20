import { describe, it, expect } from 'vitest';
import {
  OnboardingInputSchema,
  DiagnosticQuestionSchema,
  ModuleRoadmapItemSchema,
  RoadmapResponseSchema,
  QuizQuestionSchema,
  TutorChatRequestSchema,
} from '@/lib/validation';

describe('Zod Validation Schemas Unit Tests', () => {
  describe('OnboardingInputSchema', () => {
    it('accepts valid onboarding input', () => {
      const valid = {
        topic: 'Python Concurrency',
        currentLevel: 'intermediate',
        goal: 'career',
        preferredStyle: 'example-heavy',
      };
      const parsed = OnboardingInputSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects topic that is too short', () => {
      const invalid = {
        topic: 'A',
        currentLevel: 'beginner',
        goal: 'exam',
        preferredStyle: 'simple',
      };
      const parsed = OnboardingInputSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it('rejects invalid level or learning style', () => {
      const invalid = {
        topic: 'Docker',
        currentLevel: 'guru', // invalid
        goal: 'career',
        preferredStyle: 'video-only', // invalid
      };
      const parsed = OnboardingInputSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('DiagnosticQuestionSchema', () => {
    it('validates a correct 4-option MCQ schema', () => {
      const valid = {
        id: 'diag-1',
        question: 'What is non-blocking I/O?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 1,
        difficultyLevel: 'beginner',
        explanation: 'It yields control to the event loop rather than freezing.',
      };
      const parsed = DiagnosticQuestionSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects correctIndex out of range', () => {
      const invalid = {
        id: 'diag-1',
        question: 'What is non-blocking I/O?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 5, // invalid index
        difficultyLevel: 'beginner',
        explanation: 'Explanation text',
      };
      const parsed = DiagnosticQuestionSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('RoadmapResponseSchema', () => {
    it('validates roadmap with 5 modules', () => {
      const valid = {
        id: 'rm-1',
        topic: 'Node.js',
        targetLevel: 'intermediate',
        style: 'example-heavy',
        totalEstimatedMinutes: 120,
        modules: [1, 2, 3, 4, 5].map((i) => ({
          id: `mod-${i}`,
          order: i,
          title: `Module ${i}`,
          description: `Description for module ${i}`,
          estimatedMinutes: 25,
          difficulty: 'intermediate',
          learningObjectives: ['Objective 1'],
          keyConcepts: ['Concept 1'],
          status: 'locked',
          quizScore: null,
          attemptsCount: 0,
        })),
      };
      const parsed = RoadmapResponseSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects roadmap with fewer than 4 modules', () => {
      const invalid = {
        id: 'rm-1',
        topic: 'Node.js',
        targetLevel: 'intermediate',
        style: 'example-heavy',
        totalEstimatedMinutes: 50,
        modules: [
          {
            id: 'mod-1',
            order: 1,
            title: 'Module 1',
            description: 'Short desc',
            estimatedMinutes: 25,
            difficulty: 'intermediate',
            learningObjectives: ['Obj'],
            keyConcepts: ['Key'],
            status: 'locked',
            quizScore: null,
            attemptsCount: 0,
          },
        ],
      };
      const parsed = RoadmapResponseSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('TutorChatRequestSchema', () => {
    it('validates tutor chat payload', () => {
      const valid = {
        topic: 'React',
        moduleTitle: 'Components',
        userLevel: 'intermediate',
        learningStyle: 'simple',
        message: 'How does memoization work?',
      };
      const parsed = TutorChatRequestSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });
  });
});
