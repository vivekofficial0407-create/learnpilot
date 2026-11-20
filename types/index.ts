/**
 * LearnPilot - Core TypeScript Definitions
 * Strict types without `any`
 */

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export type LearningStyle = 'simple' | 'example-heavy' | 'exam-focused';

export type LearningGoal = 'career' | 'exam' | 'project' | 'interview' | 'deep-dive';

export interface UserProfile {
  topic: string;
  selfReportedLevel: UserLevel;
  assessedLevel: UserLevel;
  goal: LearningGoal;
  goalCustomText?: string;
  style: LearningStyle;
  completedOnboarding: boolean;
  createdAt: string;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0..3
  difficultyLevel: UserLevel;
  explanation: string;
}

export interface DiagnosticResult {
  score: number; // 0..4
  percentage: number;
  detectedLevel: UserLevel;
  feedback: string;
  answers: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
}

export type ModuleStatus = 'locked' | 'in-progress' | 'completed' | 'needs-review';

export interface ModuleConcept {
  name: string;
  description: string;
}

export interface ModuleRoadmapItem {
  id: string;
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: UserLevel;
  learningObjectives: string[];
  keyConcepts: string[];
  status: ModuleStatus;
  quizScore: number | null;
  attemptsCount: number;
}

export interface Roadmap {
  id: string;
  topic: string;
  targetLevel: UserLevel;
  style: LearningStyle;
  totalEstimatedMinutes: number;
  modules: ModuleRoadmapItem[];
  createdAt: string;
}

export interface ModuleContent {
  moduleId: string;
  title: string;
  coreExplanation: string;
  styleSpecificContent: {
    simpleSummary?: string;
    analogies?: string[];
    practicalCodeExamples?: {
      title: string;
      code: string;
      language: string;
      explanation: string;
    }[];
    examTipsAndPitfalls?: {
      tip: string;
      commonTrap: string;
      quickReviewFormula: string;
    }[];
  };
  keyTakeaways: string[];
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
}

export type AdaptiveAction = 'REVISE' | 'CONTINUE' | 'ADVANCE';

export interface AdaptiveDecision {
  moduleId: string;
  score: number;
  percentage: number;
  action: AdaptiveAction;
  badgeText: string;
  primaryReason: string;
  recommendations: string[];
  simplifiedSummary?: string;
  identifiedWeakTopics: string[];
  timestamp: string;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor' | 'system';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

export interface UserProgressState {
  currentModuleId: string | null;
  completedModuleIds: string[];
  moduleScores: Record<string, number>;
  weakTopics: {
    topic: string;
    failureCount: number;
    lastFailedModuleId: string;
  }[];
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalMinutesLearned: number;
  adaptiveDecisions: AdaptiveDecision[];
}

export interface DemoCourseData {
  profile: UserProfile;
  diagnostic: {
    questions: DiagnosticQuestion[];
  };
  roadmap: Roadmap;
  moduleContents: Record<string, ModuleContent>;
  quizzes: Record<string, QuizQuestion[]>;
}
