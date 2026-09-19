import type { ProgressData } from '../types'

const STORAGE_KEY = 'math-reset-progress'

export const defaultProgress: ProgressData = {
  currentStage: 2,
  scaffoldLevel: 1,
  problemsCompleted: 0,
  independentSolutions: 0,
  hintsUsed: 0,
  remaindersExplored: 0,
  correctStreak: 0,
  recentProblems: [],
  reflectionResponses: [],
  preferredPatterns: { largeFriendlyChunk: 0 },
}

export function loadProgress(): ProgressData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultProgress
    return { ...defaultProgress, ...JSON.parse(stored), preferredPatterns: { ...defaultProgress.preferredPatterns, ...JSON.parse(stored).preferredPatterns } }
  } catch {
    return defaultProgress
  }
}

export function saveProgress(progress: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}
