import { test, expect } from '@playwright/test';

test.describe('LearnPilot E2E Smoke Test - Demo Flow', () => {
  test('loads home page, launches Try Demo course, navigates to module and quiz', async ({
    page,
  }) => {
    // 1. Visit landing page
    await page.goto('/');

    // Verify brand title
    await expect(page).toHaveTitle(/LearnPilot/i);

    // 2. Click "Try Demo" button in header
    const tryDemoBtn = page.getByRole('button', { name: /Try Demo/i });
    await expect(tryDemoBtn).toBeVisible();
    await tryDemoBtn.click();

    // 3. Verify roadmap renders with sample topic
    await expect(
      page.getByRole('heading', {
        name: /Modern Asynchronous Architecture & Concurrency/i,
      })
    ).toBeVisible();

    // 4. Click "Enter Module" or "Review Module" on Module 1
    const enterModBtn = page.getByRole('button', { name: /Enter Module|Review Module|Open/i }).first();
    await expect(enterModBtn).toBeVisible();
    await enterModBtn.click();

    // 5. Verify Module Teach view is loaded
    await expect(
      page.getByRole('heading', {
        name: /Foundations of Concurrency: Threads vs Event Loops/i,
      })
    ).toBeVisible();

    // Verify Read Aloud & Ask AI Tutor buttons exist
    await expect(page.getByRole('button', { name: /Read Aloud/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Ask AI Tutor/i })).toBeVisible();

    // 6. Click "Take Module Quiz"
    const takeQuizBtn = page.getByRole('button', { name: /Take Module Quiz/i });
    await expect(takeQuizBtn).toBeVisible();
    await takeQuizBtn.click();

    // 7. Verify Quiz View renders
    await expect(page.getByText(/Module 1 Quiz Evaluation/i)).toBeVisible();
    await expect(page.getByText(/Question 1 of 5/i)).toBeVisible();
  });
});
