'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, Layers, Target, Compass, AlertCircle } from 'lucide-react';
import { UserLevel, LearningStyle, LearningGoal, UserProfile } from '@/types';
import { OnboardingInputSchema } from '@/lib/validation';
import { sanitizeTopic } from '@/lib/sanitizer';

interface OnboardingFormProps {
  onSubmit: (profile: Omit<UserProfile, 'assessedLevel' | 'completedOnboarding' | 'createdAt'>) => void;
  isLoading: boolean;
}

const SAMPLE_TOPICS = [
  'Modern Asynchronous Architecture & Concurrency',
  'Next.js 14 App Router & Server Components',
  'System Design & Microservices Scalability',
  'TypeScript Advanced Generics & Type Gymnastics',
  'Distributed Caching & Redis Patterns',
  'Kubernetes & Cloud-Native Container Orchestration',
];

export function OnboardingForm({ onSubmit, isLoading }: OnboardingFormProps) {
  const [topic, setTopic] = useState('');
  const [currentLevel, setCurrentLevel] = useState<UserLevel>('intermediate');
  const [goal, setGoal] = useState<LearningGoal>('career');
  const [goalCustomText, setGoalCustomText] = useState('');
  const [preferredStyle, setPreferredStyle] = useState<LearningStyle>('example-heavy');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const sanitized = sanitizeTopic(topic);
    const validation = OnboardingInputSchema.safeParse({
      topic: sanitized,
      currentLevel,
      goal,
      goalCustomText: goalCustomText.trim(),
      preferredStyle,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit({
      topic: sanitized,
      selfReportedLevel: currentLevel,
      goal,
      goalCustomText: goalCustomText.trim() || undefined,
      style: preferredStyle,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
      {/* Intro Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Step 1 of 3: Adaptive Calibration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What do you want to master today?
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Tell LearnPilot your subject and preferences. Our AI agent will diagnose your real level and generate a personalized curriculum.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Topic Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="topic-input"
              className="block text-sm font-bold text-slate-800 dark:text-slate-200"
            >
              1. Learning Topic <span className="text-brand-600 dark:text-brand-400">*</span>
            </label>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {topic.length}/100 chars
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <input
              id="topic-input"
              type="text"
              value={topic}
              maxLength={100}
              onChange={(e) => {
                setTopic(e.target.value);
                if (errors.topic) setErrors((prev) => ({ ...prev, topic: '' }));
              }}
              placeholder="e.g. Next.js 14 App Router, Machine Learning Basics, Docker & K8s"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm sm:text-base font-medium transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.topic
                  ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-brand-500 focus:border-brand-500'
              }`}
              aria-describedby={errors.topic ? 'topic-error' : 'topic-hint'}
              aria-required="true"
            />
          </div>

          {errors.topic ? (
            <p
              id="topic-error"
              role="alert"
              className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{errors.topic}</span>
            </p>
          ) : (
            <p id="topic-hint" className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Enter any technical, scientific, or conceptual discipline.
            </p>
          )}

          {/* Suggested Topics Pills */}
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">Suggested:</span>
            {SAMPLE_TOPICS.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setTopic(sample);
                  if (errors.topic) setErrors((prev) => ({ ...prev, topic: '' }));
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-100 dark:hover:bg-brand-950 hover:text-brand-700 dark:hover:text-brand-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Current Self-Reported Level */}
        <div>
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
            2. Self-Reported Proficiency <span className="text-brand-600 dark:text-brand-400">*</span>
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            We will follow up with 4 diagnostic questions to calibrate and verify this level.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                {
                  id: 'beginner',
                  title: 'Beginner',
                  desc: 'New to this topic; need core intuition and fundamental principles.',
                },
                {
                  id: 'intermediate',
                  title: 'Intermediate',
                  desc: 'Familiar with basics; seeking practical patterns and best practices.',
                },
                {
                  id: 'advanced',
                  title: 'Advanced',
                  desc: 'Experienced practitioner; aiming for edge-cases and architecture.',
                },
              ] as const
            ).map((item) => (
              <label
                key={item.id}
                className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                  currentLevel === item.id
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="level"
                  value={item.id}
                  checked={currentLevel === item.id}
                  onChange={() => setCurrentLevel(item.id)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {item.title}
                  </span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      currentLevel === item.id
                        ? 'border-brand-600 bg-brand-600'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {currentLevel === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Primary Goal */}
        <div>
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
            3. Primary Goal <span className="text-brand-600 dark:text-brand-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {(
              [
                { id: 'career', label: 'Career Switch' },
                { id: 'exam', label: 'Exam / Cert' },
                { id: 'project', label: 'Build Project' },
                { id: 'interview', label: 'Tech Interview' },
                { id: 'deep-dive', label: 'Curiosity Deep Dive' },
              ] as const
            ).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(g.id)}
                className={`py-2 px-3 text-xs sm:text-sm font-medium rounded-xl border text-center transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  goal === g.id
                    ? 'border-brand-500 bg-brand-600 text-white shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Learning Style */}
        <div>
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            4. Preferred Learning Style <span className="text-brand-600 dark:text-brand-400">*</span>
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Dictates how module content is formatted and taught by the agent.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                {
                  id: 'simple',
                  title: 'Simple / Intuitive',
                  badge: 'ELI5 Analogies',
                  desc: 'Bite-sized visual metaphors, conversational explanations, minimal technical jargon.',
                },
                {
                  id: 'example-heavy',
                  title: 'Example-Heavy',
                  badge: 'Code & Case Studies',
                  desc: 'Rich, executable code snippets, realistic architectural scenarios, and step-by-step walkthroughs.',
                },
                {
                  id: 'exam-focused',
                  title: 'Exam-Focused',
                  badge: 'Cheat Sheets & Traps',
                  desc: 'High-yield formulas, common multiple-choice traps, strict definitions, and rapid review summaries.',
                },
              ] as const
            ).map((styleItem) => (
              <label
                key={styleItem.id}
                className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                  preferredStyle === styleItem.id
                    ? 'border-accent-500 bg-accent-50/40 dark:bg-accent-950/30 ring-2 ring-accent-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="learningStyle"
                  value={styleItem.id}
                  checked={preferredStyle === styleItem.id}
                  onChange={() => setPreferredStyle(styleItem.id)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {styleItem.title}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-accent-100 dark:bg-accent-900/60 text-accent-700 dark:text-accent-300">
                    {styleItem.badge}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {styleItem.desc}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-md shadow-brand-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 active:scale-[0.99]"
          >
            <span>{isLoading ? 'Calibrating Agent Diagnostic...' : 'Start Diagnostic Assessment (4 MCQs)'}</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
