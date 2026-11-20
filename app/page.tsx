'use client';

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Roadmap,
  ModuleRoadmapItem,
  ModuleContent,
  QuizQuestion,
  AdaptiveDecision,
  UserProgressState,
  DiagnosticQuestion,
  DiagnosticResult,
} from '@/types';
import {
  loadProfile,
  saveProfile,
  loadRoadmap,
  saveRoadmap,
  loadProgress,
  saveProgress,
  cacheModuleContent,
  getCachedModuleContent,
  clearAllProgress,
} from '@/lib/storage';
import {
  makeAdaptiveDecision,
  calculateStreak,
  aggregateWeakTopics,
} from '@/lib/adaptive-engine';
import { DEMO_COURSE_DATA } from '@/lib/demo-data';
import { STORAGE_KEYS } from '@/lib/constants';

import { Header } from '@/components/Header';
import { OnboardingForm } from '@/components/OnboardingForm';
import { DiagnosticAssessment } from '@/components/DiagnosticAssessment';
import { RoadmapView } from '@/components/RoadmapView';
import { ModuleView } from '@/components/ModuleView';
import { QuizView } from '@/components/QuizView';
import { AgentDecisionPanel } from '@/components/AgentDecisionPanel';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { TutorChatModal } from '@/components/TutorChatModal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { AlertCircle, X } from 'lucide-react';

type AppStep =
  | 'onboarding'
  | 'diagnostic'
  | 'roadmap'
  | 'teach'
  | 'quiz'
  | 'adaptive_decision'
  | 'dashboard';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<AppStep>('onboarding');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<DiagnosticQuestion[]>([]);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleRoadmapItem | null>(null);
  const [activeModuleContent, setActiveModuleContent] = useState<ModuleContent | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentDecision, setCurrentDecision] = useState<AdaptiveDecision | null>(null);
  const [progress, setProgress] = useState<UserProgressState>(loadProgress);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('');
  const [loadingVariant, setLoadingVariant] = useState<'card' | 'roadmap' | 'module' | 'quiz'>('card');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  // Initialize theme and load persisted profile on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      const isDark =
        storedTheme === 'dark' ||
        (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Check existing progress and profile
      const savedProfile = loadProfile();
      const savedRoadmap = loadRoadmap();
      const savedProgress = loadProgress();

      if (savedProfile && savedRoadmap) {
        setProfile(savedProfile);
        setRoadmap(savedRoadmap);
        setProgress(savedProgress);
        setCurrentStep('roadmap');
      }
    } catch (err) {
      console.warn('Initialization error:', err);
    }
  }, []);

  // Theme toggle handler
  const handleToggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  };

  // Try Demo Course (Hardcoded sample course)
  const handleLoadDemoCourse = () => {
    setProfile(DEMO_COURSE_DATA.profile);
    saveProfile(DEMO_COURSE_DATA.profile);

    setRoadmap(DEMO_COURSE_DATA.roadmap);
    saveRoadmap(DEMO_COURSE_DATA.roadmap);

    // Cache all demo module contents
    Object.entries(DEMO_COURSE_DATA.moduleContents).forEach(([id, content]) => {
      cacheModuleContent(id, content);
    });

    const initialProgress: UserProgressState = {
      currentModuleId: 'mod-1',
      completedModuleIds: [],
      moduleScores: {},
      weakTopics: [],
      streakDays: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalMinutesLearned: 25,
      adaptiveDecisions: [],
    };
    setProgress(initialProgress);
    saveProgress(initialProgress);

    setCurrentStep('roadmap');
    setErrorMessage(null);
  };

  // Reset Session
  const handleResetSession = () => {
    if (window.confirm('Reset current study plan and start a new topic?')) {
      clearAllProgress();
      setProfile(null);
      setRoadmap(null);
      setActiveModule(null);
      setActiveModuleContent(null);
      setCurrentDecision(null);
      setProgress(loadProgress());
      setCurrentStep('onboarding');
      setErrorMessage(null);
    }
  };

  // Step 1: Onboarding Submit -> fetch 4 diagnostic questions
  const handleOnboardingSubmit = async (
    userInputs: Omit<UserProfile, 'assessedLevel' | 'completedOnboarding' | 'createdAt'>
  ) => {
    setIsLoading(true);
    setLoadingLabel('AI Agent is generating 4 diagnostic calibration MCQs...');
    setLoadingVariant('quiz');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: userInputs.topic,
          level: userInputs.selfReportedLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Diagnostic service unavailable');
      }

      const data = await response.json();
      setDiagnosticQuestions(data.questions);

      const partialProfile: UserProfile = {
        ...userInputs,
        assessedLevel: userInputs.selfReportedLevel,
        completedOnboarding: false,
        createdAt: new Date().toISOString(),
      };
      setProfile(partialProfile);
      setCurrentStep('diagnostic');
    } catch {
      // Offline fallback: Use curated diagnostic questions
      setDiagnosticQuestions(DEMO_COURSE_DATA.diagnostic.questions);
      const partialProfile: UserProfile = {
        ...userInputs,
        assessedLevel: userInputs.selfReportedLevel,
        completedOnboarding: false,
        createdAt: new Date().toISOString(),
      };
      setProfile(partialProfile);
      setCurrentStep('diagnostic');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Diagnostic Completed -> generate personalized 5-7 module roadmap
  const handleDiagnosticComplete = async (diagResult: DiagnosticResult) => {
    if (!profile) return;

    setIsLoading(true);
    setLoadingLabel('Synthesizing your personalized 5-7 module curriculum with time estimates...');
    setLoadingVariant('roadmap');
    setErrorMessage(null);

    const updatedProfile: UserProfile = {
      ...profile,
      assessedLevel: diagResult.detectedLevel,
      completedOnboarding: true,
    };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: updatedProfile.topic,
          level: updatedProfile.assessedLevel,
          goal: updatedProfile.goal,
          style: updatedProfile.style,
        }),
      });

      if (!response.ok) {
        throw new Error('Curriculum generator unavailable');
      }

      const data = await response.json();
      setRoadmap(data.roadmap);
      saveRoadmap(data.roadmap);
      setCurrentStep('roadmap');
    } catch {
      // Offline fallback
      const fallbackRoadmap: Roadmap = {
        ...DEMO_COURSE_DATA.roadmap,
        topic: updatedProfile.topic,
        targetLevel: updatedProfile.assessedLevel,
        style: updatedProfile.style,
      };
      setRoadmap(fallbackRoadmap);
      saveRoadmap(fallbackRoadmap);
      setCurrentStep('roadmap');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 -> 4: Select Module to Teach
  const handleSelectModule = async (moduleItem: ModuleRoadmapItem) => {
    setActiveModule(moduleItem);
    setIsLoading(true);
    setLoadingLabel(`Preparing Module ${moduleItem.order}: ${moduleItem.title}...`);
    setLoadingVariant('module');
    setErrorMessage(null);

    try {
      // Check cache first (Efficiency requirement)
      const cached = getCachedModuleContent(moduleItem.id);
      if (cached) {
        setActiveModuleContent(cached);
        setCurrentStep('teach');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: roadmap?.topic || profile?.topic,
          module: moduleItem,
          level: profile?.assessedLevel || 'intermediate',
          style: profile?.style || 'example-heavy',
        }),
      });

      if (!response.ok) {
        throw new Error('Module generator unavailable');
      }

      const data = await response.json();
      setActiveModuleContent(data.content);
      cacheModuleContent(moduleItem.id, data.content);
      setCurrentStep('teach');
    } catch {
      // Offline fallback: Use demo content or template
      const fallback =
        DEMO_COURSE_DATA.moduleContents[moduleItem.id] ||
        DEMO_COURSE_DATA.moduleContents['mod-1'];
      setActiveModuleContent(fallback);
      cacheModuleContent(moduleItem.id, fallback);
      setCurrentStep('teach');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4 -> 5: Start Module Quiz
  const handleStartQuiz = () => {
    if (!activeModule) return;
    const questions =
      DEMO_COURSE_DATA.quizzes[activeModule.id] ||
      DEMO_COURSE_DATA.quizzes['mod-1'];
    setActiveQuizQuestions(questions);
    setCurrentStep('quiz');
  };

  // Step 5 -> 6: Evaluate Quiz and trigger Adaptive Engine (PS04)
  const handleSubmitQuiz = (results: {
    score: number;
    percentage: number;
    failedConceptTags: string[];
    userAnswers: { questionId: string; selectedIndex: number }[];
  }) => {
    if (!activeModule || !roadmap || !profile) return;

    // Trigger Pure Adaptive Decision Engine
    const decision = makeAdaptiveDecision(
      activeModule.id,
      results.percentage,
      results.failedConceptTags,
      profile.assessedLevel,
      profile.style
    );

    setCurrentDecision(decision);

    // Update streak and weak topics
    const streakResult = calculateStreak(progress.lastActiveDate, progress.streakDays);
    const updatedWeakTopics = aggregateWeakTopics(
      progress.weakTopics,
      results.failedConceptTags,
      activeModule.id
    );

    const isPassed = results.percentage >= 60;

    // Update Module Roadmap item state
    const updatedModules = roadmap.modules.map((m) => {
      if (m.id === activeModule.id) {
        return {
          ...m,
          quizScore: results.percentage,
          attemptsCount: m.attemptsCount + 1,
          status: isPassed ? ('completed' as const) : ('needs-review' as const),
        };
      }
      return m;
    });

    // If passed, unlock next module
    if (isPassed) {
      const currentIndex = updatedModules.findIndex((m) => m.id === activeModule.id);
      if (currentIndex !== -1 && currentIndex + 1 < updatedModules.length) {
        if (updatedModules[currentIndex + 1].status === 'locked') {
          updatedModules[currentIndex + 1].status = 'in-progress';
        }
      }
    }

    const updatedRoadmap: Roadmap = {
      ...roadmap,
      modules: updatedModules,
    };
    setRoadmap(updatedRoadmap);
    saveRoadmap(updatedRoadmap);

    // Update Progress State
    const updatedProgress: UserProgressState = {
      ...progress,
      streakDays: streakResult.newStreak,
      lastActiveDate: streakResult.updatedDate,
      totalMinutesLearned: progress.totalMinutesLearned + activeModule.estimatedMinutes,
      moduleScores: {
        ...progress.moduleScores,
        [activeModule.id]: results.percentage,
      },
      completedModuleIds: isPassed
        ? Array.from(new Set([...progress.completedModuleIds, activeModule.id]))
        : progress.completedModuleIds,
      weakTopics: updatedWeakTopics,
      adaptiveDecisions: [decision, ...progress.adaptiveDecisions],
    };

    setProgress(updatedProgress);
    saveProgress(updatedProgress);

    setCurrentStep('adaptive_decision');
  };

  // Continue to Next Module from Decision Panel
  const handleContinueNextModule = () => {
    if (!roadmap || !activeModule) {
      setCurrentStep('roadmap');
      return;
    }

    const currentIndex = roadmap.modules.findIndex((m) => m.id === activeModule.id);
    if (currentIndex !== -1 && currentIndex + 1 < roadmap.modules.length) {
      const nextMod = roadmap.modules[currentIndex + 1];
      handleSelectModule(nextMod);
    } else {
      // Reached end of roadmap, go to dashboard
      setCurrentStep('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Top Header Navigation */}
      <Header
        streakDays={progress.streakDays}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onLoadDemo={handleLoadDemoCourse}
        onReset={handleResetSession}
        hasActiveCourse={!!roadmap}
      />

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Notification Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-center justify-between shadow-sm animate-fadeIn"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Global Loading Indicator */}
        {isLoading ? (
          <SkeletonLoader label={loadingLabel} variant={loadingVariant} />
        ) : (
          <>
            {/* Step 1: Onboarding */}
            {currentStep === 'onboarding' && (
              <OnboardingForm onSubmit={handleOnboardingSubmit} isLoading={isLoading} />
            )}

            {/* Step 2: Diagnostic Assessment */}
            {currentStep === 'diagnostic' && profile && (
              <DiagnosticAssessment
                topic={profile.topic}
                selfReportedLevel={profile.selfReportedLevel}
                questions={diagnosticQuestions}
                onComplete={handleDiagnosticComplete}
                isPlanningRoadmap={isLoading}
              />
            )}

            {/* Step 3: Roadmap Stepper */}
            {currentStep === 'roadmap' && roadmap && profile && (
              <RoadmapView
                roadmap={roadmap}
                profile={profile}
                onSelectModule={handleSelectModule}
                onViewDashboard={() => setCurrentStep('dashboard')}
              />
            )}

            {/* Step 4: Module Teach View */}
            {currentStep === 'teach' && activeModule && activeModuleContent && profile && (
              <ModuleView
                module={activeModule}
                content={activeModuleContent}
                profile={profile}
                onBackToRoadmap={() => setCurrentStep('roadmap')}
                onStartQuiz={handleStartQuiz}
                onOpenTutor={() => setIsTutorOpen(true)}
              />
            )}

            {/* Step 5: Quiz View */}
            {currentStep === 'quiz' && activeModule && (
              <QuizView
                module={activeModule}
                questions={activeQuizQuestions}
                onSubmitQuiz={handleSubmitQuiz}
                onCancel={() => setCurrentStep('teach')}
              />
            )}

            {/* Step 6: Visible Agent Decision Panel (PS04) */}
            {currentStep === 'adaptive_decision' && currentDecision && activeModule && (
              <AgentDecisionPanel
                decision={currentDecision}
                module={activeModule}
                onRetryQuiz={() => setCurrentStep('quiz')}
                onReviewSimplified={() => setCurrentStep('teach')}
                onContinueNext={handleContinueNextModule}
                hasNextModule={
                  roadmap
                    ? roadmap.modules.findIndex((m) => m.id === activeModule.id) + 1 <
                      roadmap.modules.length
                    : false
                }
              />
            )}

            {/* Step 7: Progress Dashboard */}
            {currentStep === 'dashboard' && roadmap && profile && (
              <ProgressDashboard
                progress={progress}
                roadmap={roadmap}
                profile={profile}
                onBackToRoadmap={() => setCurrentStep('roadmap')}
              />
            )}
          </>
        )}

        {/* Ask-the-Tutor Contextual Chat Modal */}
        {activeModule && profile && (
          <TutorChatModal
            isOpen={isTutorOpen}
            onClose={() => setIsTutorOpen(false)}
            topic={roadmap?.topic || profile.topic}
            moduleTitle={activeModule.title}
            userLevel={profile.assessedLevel}
            learningStyle={profile.style}
          />
        )}
      </main>

      {/* Footer Landmark */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            LearnPilot &copy; {new Date().getFullYear()} • Problem Statement PS04 Alignment • Built for high reliability, accessibility & adaptive intelligence.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Adaptive Agent Active</span>
            </span>
            <span>WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
