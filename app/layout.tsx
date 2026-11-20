import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LearnPilot - Personalized AI Learning Agent (PS04)',
  description:
    'Production-grade adaptive AI learning agent that assesses real baseline knowledge, synthesizes personalized roadmaps, teaches with tailored examples, and dynamically adapts difficulty based on quiz performance.',
  keywords: [
    'AI Learning Agent',
    'Adaptive Learning',
    'Personalized Education',
    'PS04',
    'Next.js',
    'Tailwind CSS',
    'TypeScript',
  ],
  authors: [{ name: 'LearnPilot AI' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-Flicker Theme Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('learnpilot_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        {/* Skip to Main Content Link (WCAG Accessibility) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-lg focus:shadow-xl focus:font-bold"
        >
          Skip to main content
        </a>

        {children}
      </body>
    </html>
  );
}
