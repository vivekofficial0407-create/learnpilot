/**
 * LearnPilot - API Route: /api/plan
 * Generates a personalized 5-7 module study roadmap with time estimates.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { sanitizeTopic } from '@/lib/sanitizer';
import {
  UserLevelSchema,
  LearningStyleSchema,
  LearningGoalSchema,
} from '@/lib/validation';
import { generateRoadmap } from '@/lib/llm';
import { z } from 'zod';

const RequestSchema = z.object({
  topic: z.string().min(2).max(100),
  level: UserLevelSchema,
  goal: LearningGoalSchema,
  style: LearningStyleSchema,
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
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
        { error: 'Invalid roadmap planning inputs', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { topic, level, goal, style } = parsed.data;
    const safeTopic = sanitizeTopic(topic);

    const roadmap = await generateRoadmap(safeTopic, level, goal, style);

    return NextResponse.json({
      success: true,
      roadmap,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
