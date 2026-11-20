import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { QuizView } from '@/components/QuizView';
import { QuizQuestion, ModuleRoadmapItem } from '@/types';

const mockModule: ModuleRoadmapItem = {
  id: 'mod-1',
  order: 1,
  title: 'Foundations of Concurrency',
  description: 'Understand OS thread scheduling',
  estimatedMinutes: 25,
  difficulty: 'beginner',
  learningObjectives: ['Objective 1'],
  keyConcepts: ['Event Loop'],
  status: 'in-progress',
  quizScore: null,
  attemptsCount: 0,
};

const mockQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    moduleId: 'mod-1',
    question: 'What is non-blocking I/O?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    explanation: 'Yields thread back to event loop.',
    conceptTag: 'Event Loop',
  },
  {
    id: 'q2',
    moduleId: 'mod-1',
    question: 'What is a race condition?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 1,
    explanation: 'Unpredictable execution timing.',
    conceptTag: 'Race Conditions',
  },
];

describe('QuizView Component', () => {
  it('renders question and options with accessibility markers', () => {
    const onSubmitQuiz = vi.fn();
    const onCancel = vi.fn();

    render(
      <QuizView
        module={mockModule}
        questions={mockQuestions}
        onSubmitQuiz={onSubmitQuiz}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText(/Foundations of Concurrency/i)).toBeInTheDocument();
    expect(screen.getByText('What is non-blocking I/O?')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('allows answering questions and reveals review summary upon submission', () => {
    const onSubmitQuiz = vi.fn();
    const onCancel = vi.fn();

    render(
      <QuizView
        module={mockModule}
        questions={mockQuestions}
        onSubmitQuiz={onSubmitQuiz}
        onCancel={onCancel}
      />
    );

    // Answer Q1 with Option A (correctIndex 0)
    const optionA = screen.getByText('Option A');
    fireEvent.click(optionA);

    // Move to next question
    const nextBtn = screen.getByRole('button', { name: /Next Question/i });
    fireEvent.click(nextBtn);

    // Answer Q2 with Option B (correctIndex 1)
    const optionB = screen.getByText('Option B');
    fireEvent.click(optionB);

    // Submit Quiz
    const submitBtn = screen.getByRole('button', {
      name: /Submit Quiz for Agent Evaluation/i,
    });
    fireEvent.click(submitBtn);

    // Review summary should appear
    expect(screen.getByText(/Quiz Evaluation Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/2 \/ 2 Correct/i)).toBeInTheDocument();

    // Click Proceed to Decision
    const proceedBtn = screen.getByRole('button', {
      name: /View Agent Decision & Next Step/i,
    });
    fireEvent.click(proceedBtn);

    expect(onSubmitQuiz).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 2,
        percentage: 100,
      })
    );
  });
});
