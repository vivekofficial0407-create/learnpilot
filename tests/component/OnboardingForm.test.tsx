import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { OnboardingForm } from '@/components/OnboardingForm';

describe('OnboardingForm Component', () => {
  it('renders learning topic input and options', () => {
    const onSubmit = vi.fn();
    render(<OnboardingForm onSubmit={onSubmit} isLoading={false} />);

    expect(screen.getByLabelText(/Learning Topic/i)).toBeInTheDocument();
    expect(screen.getByText(/Self-Reported Proficiency/i)).toBeInTheDocument();
    expect(screen.getByText(/Preferred Learning Style/i)).toBeInTheDocument();
  });

  it('shows error when submitting empty topic', () => {
    const onSubmit = vi.fn();
    render(<OnboardingForm onSubmit={onSubmit} isLoading={false} />);

    const submitBtn = screen.getByRole('button', {
      name: /Start Diagnostic Assessment/i,
    });
    fireEvent.click(submitBtn);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('submits valid input successfully', () => {
    const onSubmit = vi.fn();
    render(<OnboardingForm onSubmit={onSubmit} isLoading={false} />);

    const topicInput = screen.getByLabelText(/Learning Topic/i);
    fireEvent.change(topicInput, { target: { value: 'Distributed Systems' } });

    const submitBtn = screen.getByRole('button', {
      name: /Start Diagnostic Assessment/i,
    });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        topic: 'Distributed Systems',
        selfReportedLevel: 'intermediate',
        style: 'example-heavy',
      })
    );
  });
});
