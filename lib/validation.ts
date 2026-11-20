/**
 * LearnPilot - Zod Validation Schemas
 * Comprehensive runtime validation for user inputs and LLM responses.
 */

import { z } from 'zod';

export const UserLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const LearningStyleSchema = z.enum(['simple', 'example-heavy', 'exam-focused']);
export const LearningGoalSchema = z.enum(['career', 'exam', 'project', 'interview', 'deep-dive']);

// User Onboarding Input Schema
export const OnboardingInputSchema = z.object({
  topic: z
    .string()
    .min(2, { message: 'Topic must be at least 2 characters long' })
    .max(100, { message: 'Topic must be at most 100 characters' }),
  currentLevel: UserLevelSchema,
  goal: LearningGoalSchema,
  goalCustomText: z.string().max(200).optional(),
  preferredStyle: LearningStyleSchema,
});

export type OnboardingInput = z.infer<typeof OnboardingInputSchema>;

// Diagnostic Question Schema
export const DiagnosticQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(5),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctIndex: z.number().int().min(0).max(3),
  difficultyLevel: UserLevelSchema,
  explanation: z.string().min(5),
});

export const DiagnosticQuestionsResponseSchema = z.object({
  questions: z.array(DiagnosticQuestionSchema).min(3).max(5),
});

// Diagnostic Assessment Submission Schema
export const DiagnosticSubmitSchema = z.object({
  topic: z.string().min(2),
  selfReportedLevel: UserLevelSchema,
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedIndex: z.number().int().min(0).max(3),
    })
  ),
});

// Roadmap Module Schema
export const ModuleRoadmapItemSchema = z.object({
  id: z.string(),
  order: z.number().int().positive(),
  title: z.string().min(3),
  description: z.string().min(10),
  estimatedMinutes: z.number().int().min(5).max(180),
  difficulty: UserLevelSchema,
  learningObjectives: z.array(z.string()).min(1),
  keyConcepts: z.array(z.string()).min(1),
  status: z.enum(['locked', 'in-progress', 'completed', 'needs-review']).default('locked'),
  quizScore: z.number().nullable().default(null),
  attemptsCount: z.number().int().min(0).default(0),
});

export const RoadmapResponseSchema = z.object({
  id: z.string(),
  topic: z.string(),
  targetLevel: UserLevelSchema,
  style: LearningStyleSchema,
  totalEstimatedMinutes: z.number().int().positive(),
  modules: z.array(ModuleRoadmapItemSchema).min(4).max(8),
});

// Teach Module Content Schema
export const ModuleContentSchema = z.object({
  moduleId: z.string(),
  title: z.string(),
  coreExplanation: z.string().min(30),
  styleSpecificContent: z.object({
    simpleSummary: z.string().optional(),
    analogies: z.array(z.string()).optional(),
    practicalCodeExamples: z
      .array(
        z.object({
          title: z.string(),
          code: z.string(),
          language: z.string(),
          explanation: z.string(),
        })
      )
      .optional(),
    examTipsAndPitfalls: z
      .array(
        z.object({
          tip: z.string(),
          commonTrap: z.string(),
          quickReviewFormula: z.string(),
        })
      )
      .optional(),
  }),
  keyTakeaways: z.array(z.string()).min(1),
});

// Quiz Schema
export const QuizQuestionSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  question: z.string().min(5),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(5),
  conceptTag: z.string().min(2),
});

export const QuizResponseSchema = z.object({
  moduleId: z.string(),
  questions: z.array(QuizQuestionSchema).min(3).max(6),
});

// Quiz Submit Schema
export const QuizSubmitSchema = z.object({
  moduleId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedIndex: z.number().int().min(0).max(3),
    })
  ),
});

// Tutor Chat Schema
export const TutorChatRequestSchema = z.object({
  topic: z.string(),
  moduleTitle: z.string(),
  userLevel: UserLevelSchema,
  learningStyle: LearningStyleSchema,
  message: z.string().min(1).max(500),
  chatHistory: z
    .array(
      z.object({
        sender: z.enum(['user', 'tutor', 'system']),
        content: z.string(),
      })
    )
    .optional(),
});
