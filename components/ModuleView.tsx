'use client';

import React, { useState } from 'react';
import {
  ModuleRoadmapItem,
  ModuleContent,
  UserProfile,
} from '@/types';
import {
  ArrowLeft,
  BookOpen,
  Code,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  MessageSquare,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ModuleViewProps {
  module: ModuleRoadmapItem;
  content: ModuleContent;
  profile: UserProfile;
  onBackToRoadmap: () => void;
  onStartQuiz: () => void;
  onOpenTutor: () => void;
}

export function ModuleView({
  module,
  content,
  profile,
  onBackToRoadmap,
  onStartQuiz,
  onOpenTutor,
}: ModuleViewProps) {
  const [activeTab, setActiveTab] = useState<'explanation' | 'examples' | 'pitfalls' | 'takeaways'>('explanation');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Web Speech API text-to-speech for accessibility
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${module.title}. ${content.coreExplanation}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const { styleSpecificContent } = content;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToRoadmap}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Roadmap</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              isSpeaking
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
            title="Read module content aloud using text-to-speech"
            aria-label={isSpeaking ? 'Stop reading aloud' : 'Read module aloud'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-slate-500" aria-hidden="true" />
                <span>Read Aloud</span>
              </>
            )}
          </button>

          {/* Ask AI Tutor */}
          <button
            type="button"
            onClick={onOpenTutor}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Module Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            Module {module.order}
          </span>
          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
            {module.difficulty} Level
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            ~{module.estimatedMinutes} mins study time
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {module.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {module.description}
        </p>

        {/* Learning Objectives Box */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Target Learning Objectives:
          </h2>
          <ul className="space-y-1.5">
            {module.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('explanation')}
          className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-bold text-sm transition-all focus:outline-none whitespace-nowrap ${
            activeTab === 'explanation'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>Core Concept</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('examples')}
          className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-bold text-sm transition-all focus:outline-none whitespace-nowrap ${
            activeTab === 'examples'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" aria-hidden="true" />
          <span>
            {profile.style === 'simple'
              ? 'Intuitive Analogies'
              : profile.style === 'exam-focused'
              ? 'Formulas & Rules'
              : 'Practical Code & Examples'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pitfalls')}
          className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-bold text-sm transition-all focus:outline-none whitespace-nowrap ${
            activeTab === 'pitfalls'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          <span>Pitfalls & Traps</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('takeaways')}
          className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-bold text-sm transition-all focus:outline-none whitespace-nowrap ${
            activeTab === 'takeaways'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          <span>Key Takeaways</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[300px]">
        {/* Core Concept Tab */}
        {activeTab === 'explanation' && (
          <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {content.coreExplanation}

            {styleSpecificContent.simpleSummary && (
              <div className="mt-6 p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800">
                <div className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-300 text-xs sm:text-sm mb-1">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Agent Style Note (Simple / ELI5):</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {styleSpecificContent.simpleSummary}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Examples / Analogies Tab */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            {/* Analogies if present */}
            {styleSpecificContent.analogies && styleSpecificContent.analogies.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Intuitive Mental Models & Analogies:
                </h3>
                {styleSpecificContent.analogies.map((analogy, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-200"
                  >
                    💡 {analogy}
                  </div>
                ))}
              </div>
            )}

            {/* Practical Code Snippets */}
            {styleSpecificContent.practicalCodeExamples &&
            styleSpecificContent.practicalCodeExamples.length > 0 ? (
              <div className="space-y-6">
                {styleSpecificContent.practicalCodeExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {ex.title} ({ex.language})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(ex.code, idx)}
                        className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 rounded px-2 py-0.5"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-950 text-slate-100 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
                      <code>{ex.code}</code>
                    </pre>
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Walkthrough:
                      </span>{' '}
                      {ex.explanation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !styleSpecificContent.analogies && (
                <p className="text-sm text-slate-500">
                  Focus on the core concept and takeaways above. You can ask the tutor for tailored examples!
                </p>
              )
            )}
          </div>
        )}

        {/* Pitfalls & Traps Tab */}
        {activeTab === 'pitfalls' && (
          <div className="space-y-4">
            {styleSpecificContent.examTipsAndPitfalls &&
            styleSpecificContent.examTipsAndPitfalls.length > 0 ? (
              styleSpecificContent.examTipsAndPitfalls.map((pitfall, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 space-y-2"
                >
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs sm:text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Common Trap: {pitfall.commonTrap}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-6">
                    <span className="font-semibold">Remedy / Tip:</span> {pitfall.tip}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-6 italic">
                    Recall Rule: {pitfall.quickReviewFormula}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">
                No high-risk exam traps registered for this module yet. Master the key takeaways!
              </div>
            )}
          </div>
        )}

        {/* Key Takeaways Tab */}
        {activeTab === 'takeaways' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Essential Takeaways to Retain:
            </h3>
            <ul className="space-y-2.5">
              {content.keyTakeaways.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Start Quiz Action CTA */}
      <div className="bg-gradient-to-r from-brand-600 to-accent-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold">
            Ready to test your comprehension?
          </h3>
          <p className="text-xs sm:text-sm text-brand-100 mt-1">
            5 questions to evaluate mastery and trigger the LearnPilot adaptive feedback loop.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartQuiz}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-white active:scale-95"
        >
          <span>Take Module Quiz</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
