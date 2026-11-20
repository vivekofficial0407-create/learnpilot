/**
 * LearnPilot - Client-Side Storage Manager
 * Safely persists user profile, study plan, module cache, and progress state in localStorage.
 * Handles SSR safety and corrupt storage recovery.
 */

import { UserProfile, Roadmap, UserProgressState, ModuleContent } from '@/types';
import { STORAGE_KEYS } from './constants';

const isBrowser = typeof window !== 'undefined';

/**
 * Loads user profile from localStorage
 */
export function loadProfile(): UserProfile | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch (err) {
    console.warn('Failed to parse profile from storage:', err);
    return null;
  }
}

/**
 * Saves user profile to localStorage
 */
export function saveProfile(profile: UserProfile): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to storage:', err);
  }
}

/**
 * Loads active roadmap from localStorage
 */
export function loadRoadmap(): Roadmap | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    if (!raw) return null;
    return JSON.parse(raw) as Roadmap;
  } catch (err) {
    console.warn('Failed to parse roadmap from storage:', err);
    return null;
  }
}

/**
 * Saves active roadmap to localStorage
 */
export function saveRoadmap(roadmap: Roadmap): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
  } catch (err) {
    console.error('Failed to save roadmap to storage:', err);
  }
}

/**
 * Loads user progress state from localStorage or initializes default
 */
export function loadProgress(): UserProgressState {
  const defaultState: UserProgressState = {
    currentModuleId: null,
    completedModuleIds: [],
    moduleScores: {},
    weakTopics: [],
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalMinutesLearned: 0,
    adaptiveDecisions: [],
  };

  if (!isBrowser) return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Failed to parse progress from storage:', err);
    return defaultState;
  }
}

/**
 * Saves user progress state to localStorage
 */
export function saveProgress(progress: UserProgressState): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to storage:', err);
  }
}

/**
 * Caches a generated module content to prevent duplicate LLM calls
 */
export function cacheModuleContent(moduleId: string, content: ModuleContent): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(
      `${STORAGE_KEYS.MODULE_CACHE_PREFIX}${moduleId}`,
      JSON.stringify(content)
    );
  } catch (err) {
    console.warn('Failed to cache module content:', err);
  }
}

/**
 * Retrieves cached module content if available
 */
export function getCachedModuleContent(moduleId: string): ModuleContent | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.MODULE_CACHE_PREFIX}${moduleId}`);
    if (!raw) return null;
    return JSON.parse(raw) as ModuleContent;
  } catch {
    return null;
  }
}

/**
 * Clears all LearnPilot user data to reset the session
 */
export function clearAllProgress(): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.ROADMAP);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.DIAGNOSTIC_STATE);

    // Clear module caches
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEYS.MODULE_CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}
