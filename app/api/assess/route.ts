/**
 * LearnPilot - API Route: /api/assess
 * Generates 4 diagnostic MCQs to detect authentic level.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { sanitizeTopic } from '@/lib/sanitizer';
import { UserLevelSchema } from '@/lib/validation';
import { generateDiagnosticQuestions } from '@/lib/llm';
import { z } from 'zod';

const RequestSchema = z.object({
  topic: z.string().min(2).max(100),
  level: UserLevelSchema,
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before retrying.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateCheck.resetTimeMs - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid assessment request parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const safeTopic = sanitizeTopic(parsed.data.topic);
    const safeLevel = parsed.data.level;

    const questions = await generateDiagnosticQuestions(safeTopic, safeLevel);

    return NextResponse.json({
      success: true,
      topic: safeTopic,
      level: safeLevel,
      questions,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
