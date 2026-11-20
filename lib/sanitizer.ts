/**
 * LearnPilot - Input Sanitizer and Injection Guard
 * Protects against XSS, HTML injection, and prompt injection attacks.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
};

// Patterns commonly associated with LLM prompt injection / jailbreak attempts
const SUSPICIOUS_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+a/i,
  /jailbreak/i,
  /developer\s+mode/i,
  /DAN\s+mode/i,
  /reveal\s+(api\s+)?key/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
];

/**
 * Strips HTML tags and harmful characters
 */
export function stripHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '');
}

/**
 * Escapes HTML characters for safe rendering
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[&<>"'`\/]/g, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * Detects if the user input contains high-risk prompt injection patterns
 */
export function detectPotentialInjection(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Sanitizes user input: strips HTML, collapses repeated whitespace,
 * enforces length limits, and neutralizes prompt-altering directives.
 *
 * @param input Raw text input from user
 * @param maxLength Maximum allowed length (default 200)
 * @returns Clean, safe string
 */
export function sanitizeInput(input: string, maxLength = 250): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // 1. Strip raw HTML tags
  let cleaned = stripHtml(input);

  // 2. Remove non-printable control characters except standard newlines & tabs
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 3. Normalize whitespace (collapse multiple spaces into one)
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 4. Neutralize common prompt injection prefixes if present
  cleaned = cleaned.replace(/^(system|user|assistant):/gi, '');

  // 5. Truncate to maximum length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength).trim();
  }

  return cleaned;
}

/**
 * Sanitizes learning topic specifically
 */
export function sanitizeTopic(topic: string): string {
  return sanitizeInput(topic, 100);
}

/**
 * Sanitizes chat messages from user to tutor
 */
export function sanitizeTutorMessage(message: string): string {
  return sanitizeInput(message, 500);
}
