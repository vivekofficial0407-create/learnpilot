/**
 * LearnPilot - API Route: /api/module
 * Generates tailored module explanation and examples matching style and level.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { sanitizeTopic } from '@/lib/sanitizer';
import {
  UserLevelSchema,
  LearningStyleSchema,
  ModuleRoadmapItemSchema,
} from '@/lib/validation';
import { generateModuleContent } from '@/lib/llm';
import { z } from 'zod';

const RequestSchema = z.object({
  topic: z.string().min(2).max(100),
  module: ModuleRoadmapItemSchema,
  level: UserLevelSchema,
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
        { error: 'Invalid module content parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { topic, module: moduleItem, level, style } = parsed.data;
    const safeTopic = sanitizeTopic(topic);

    const content = await generateModuleContent(safeTopic, moduleItem, level, style);

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
