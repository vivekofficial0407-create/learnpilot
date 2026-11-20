/**
 * LearnPilot - In-Memory IP Rate Limiter
 * Enforces per-IP request caps with a sliding-window algorithm.
 */

import { RATE_LIMIT } from './constants';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store mapping IP -> timestamps of requests
const ipStore = new Map<string, RateLimitRecord>();

// Clean up stale IP records every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    ipStore.forEach((record, ip) => {
      record.timestamps = record.timestamps.filter(
        (t: number) => now - t < RATE_LIMIT.WINDOW_MS
      );
      if (record.timestamps.length === 0) {
        ipStore.delete(ip);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTimeMs: number;
}

/**
 * Checks if a given IP address is within rate limits.
 *
 * @param ip Client IP address string
 * @param maxRequests Max allowed requests within window (defaults to RATE_LIMIT.MAX_REQUESTS_PER_WINDOW)
 * @param windowMs Window in ms (defaults to RATE_LIMIT.WINDOW_MS)
 */
export function checkRateLimit(
  ip: string,
  maxRequests = RATE_LIMIT.MAX_REQUESTS_PER_WINDOW,
  windowMs = RATE_LIMIT.WINDOW_MS
): RateLimitResult {
  const normalizedIp = ip || 'anonymous';
  const now = Date.now();

  let record = ipStore.get(normalizedIp);
  if (!record) {
    record = { timestamps: [] };
    ipStore.set(normalizedIp, record);
  }

  // Filter out timestamps older than the sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  const resetTimeMs =
    record.timestamps.length > 0 ? record.timestamps[0] + windowMs : now + windowMs;

  if (record.timestamps.length >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTimeMs,
    };
  }

  // Record this request
  record.timestamps.push(now);

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.timestamps.length,
    resetTimeMs,
  };
}

/**
 * Helper to extract IP from Next.js request headers
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
