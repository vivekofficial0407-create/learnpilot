/**
 * LearnPilot - API Route: /api/tutor
 * Context-aware AI tutor chat endpoint inside modules.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { sanitizeTutorMessage, sanitizeTopic } from '@/lib/sanitizer';
import { TutorChatRequestSchema } from '@/lib/validation';
import { askTutor } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Tutor chat rate limit reached. Please wait.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateCheck.resetTimeMs - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await req.json();
    const parsed = TutorChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid tutor request', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { topic, moduleTitle, userLevel, learningStyle, message, chatHistory } =
      parsed.data;
    const safeMessage = sanitizeTutorMessage(message);
    const safeTopic = sanitizeTopic(topic);

    const tutorResult = await askTutor(
      safeTopic,
      moduleTitle,
      userLevel,
      learningStyle,
      safeMessage,
      chatHistory
    );

    return NextResponse.json({
      success: true,
      reply: tutorResult.reply,
      suggestedFollowUps: tutorResult.suggestedFollowUps,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
