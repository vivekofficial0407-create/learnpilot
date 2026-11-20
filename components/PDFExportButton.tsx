'use client';

import React, { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { Roadmap, UserProfile } from '@/types';

interface PDFExportButtonProps {
  roadmap: Roadmap;
  profile: UserProfile;
}

export function PDFExportButton({ roadmap, profile }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Dynamically load jsPDF to optimize initial bundle size
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;

      // Header Banner
      doc.setFillColor(2, 132, 199); // Brand blue
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('LearnPilot - Personalized Study Plan', margin, 18);

      y = 38;
      doc.setTextColor(30, 41, 59);

      // Metadata Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Topic: ${roadmap.topic}`, margin, y);
      y += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Target Level: ${roadmap.targetLevel.toUpperCase()}  |  Style: ${roadmap.style}  |  Goal: ${profile.goal}`,
        margin,
        y
      );
      y += 6;
      doc.text(
        `Total Estimated Duration: ${roadmap.totalEstimatedMinutes} minutes across ${roadmap.modules.length} modules`,
        margin,
        y
      );
      y += 6;
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, y);
      y += 10;

      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Modules Listing
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Curriculum Modules & Milestones', margin, y);
      y += 8;

      roadmap.modules.forEach((mod, index) => {
        // Page overflow check
        if (y > 255) {
          doc.addPage();
          y = 20;
        }

        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 28, 2, 2, 'F');

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(2, 132, 199);
        doc.text(`Module ${index + 1}: ${mod.title}`, margin + 4, y + 2);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(
          `Estimated Time: ${mod.estimatedMinutes} mins  |  Difficulty: ${mod.difficulty}`,
          margin + 4,
          y + 8
        );

        const shortDesc = doc.splitTextToSize(mod.description, pageWidth - margin * 2 - 8);
        doc.text(shortDesc, margin + 4, y + 14);

        y += 32;
      });

      // Adaptive Engine Guidelines
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      y += 6;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('LearnPilot Adaptive Feedback Loop (PS04)', margin, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const advice = [
        '• After each module quiz, the agent analyzes your score and concept mastery.',
        '• Scores <60%: The agent automatically provides a simplified review with fresh analogies.',
        '• Scores 60-85%: You advance steadily to the next roadmap milestone.',
        '• Scores >85%: The agent accelerates difficulty and unlocks challenge material.',
      ];
      advice.forEach((line) => {
        doc.text(line, margin, y);
        y += 5;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Generated with LearnPilot - AI Adaptive Personalized Learning System',
        margin,
        287
      );

      // Save file
      const filename = `LearnPilot_${roadmap.topic.replace(/[^a-zA-Z0-9]/g, '_')}_StudyPlan.pdf`;
      doc.save(filename);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
      aria-label="Export personalized study roadmap as PDF"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin text-brand-600 dark:text-brand-400" aria-hidden="true" />
      ) : isSuccess ? (
        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
      ) : (
        <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
      )}
      <span>{isExporting ? 'Generating PDF...' : isSuccess ? 'Downloaded!' : 'Export PDF Plan'}</span>
    </button>
  );
}
