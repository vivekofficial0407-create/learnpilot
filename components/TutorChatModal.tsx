'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TutorMessage, UserLevel, LearningStyle } from '@/types';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Loader2,
  Lightbulb,
} from 'lucide-react';

interface TutorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  moduleTitle: string;
  userLevel: UserLevel;
  learningStyle: LearningStyle;
}

const DEFAULT_SUGGESTIONS = [
  'Can you explain this like I am 5 with an analogy?',
  'What is the most common real-world bug with this?',
  'Could you show a minimal TypeScript code example?',
  'How is this typically tested in tech interviews?',
];

export function TutorChatModal({
  isOpen,
  onClose,
  topic,
  moduleTitle,
  userLevel,
  learningStyle,
}: TutorChatModalProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      content: `Hello! I am your 1-on-1 AI Tutor for **${moduleTitle}**. Ask me any doubt, request a simpler breakdown, or ask for practical examples!`,
      timestamp: new Date().toISOString(),
      suggestedFollowUps: DEFAULT_SUGGESTIONS,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: TutorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          moduleTitle,
          userLevel,
          learningStyle,
          message: text,
          chatHistory: messages.map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Tutor response failed');
      }

      const data = await response.json();
      const tutorMsg: TutorMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        content: data.reply,
        timestamp: new Date().toISOString(),
        suggestedFollowUps: data.suggestedFollowUps || DEFAULT_SUGGESTIONS,
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch {
      // Fallback offline reply
      const fallbackMsg: TutorMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        content: `Great question regarding **${moduleTitle}**! In short, the core mechanism balances throughput and safety. Ensure you handle edge cases and cancellation tokens properly to avoid unhandled state corruption. Let me know if you would like a code snippet!`,
        timestamp: new Date().toISOString(),
        suggestedFollowUps: [
          'Show me a code snippet',
          'What are the memory implications?',
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const lastTutorMessage = [...messages].reverse().find((m) => m.sender === 'tutor');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutor-dialog-title"
    >
      <div className="w-full max-w-2xl h-[650px] max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="tutor-dialog-title"
                className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white"
              >
                1-on-1 AI Tutor
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                Topic: {moduleTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Close AI Tutor Chat"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-slate-700 dark:bg-slate-600'
                    : 'bg-brand-600'
                }`}
                aria-hidden="true"
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {/* Typing Skeleton */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Tutor is formulating explanation...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestions Chips */}
        {lastTutorMessage?.suggestedFollowUps &&
          lastTutorMessage.suggestedFollowUps.length > 0 &&
          !isLoading && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Suggested Questions:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {lastTutorMessage.suggestedFollowUps.map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(suggestion)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 transition-colors text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            maxLength={500}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about this module..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-40"
            aria-label="Send question to tutor"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
