export type Confidence = 'comfortable' | 'rusty' | 'difficult' | 'anxious'
export type Screen = 'home' | 'checkin' | 'practice' | 'complete' | 'progress' | 'fractions'
export type FeedbackTone = 'positive' | 'neutral' | 'warm'

export interface Problem {
  id: string
  dividend: number
  divisor: number
  stage: 1 | 2 | 3 | 4
  suggestedSplits: [number, number][]
  hintMultiples: number[]
  concept: 'relationship' | 'decomposition' | 'flexibility' | 'remainders'
}

export interface ProgressData {
  confidenceStart?: Confidence
  currentStage: 1 | 2 | 3 | 4
  scaffoldLevel: 1 | 2 | 3
  problemsCompleted: number
  independentSolutions: number
  hintsUsed: number
  remaindersExplored: number
  correctStreak: number
  recentProblems: string[]
  reflectionResponses: string[]
  preferredPatterns: { largeFriendlyChunk: number }
  fractionProgress: { problemsCompleted: number; correctStreak: number; equivalentFractions: number; comparisons: number }
}

export type FractionKind = 'build' | 'equivalent' | 'compare'

export interface FractionProblem {
  id: string
  kind: FractionKind
  numerator: number
  denominator: number
  prompt: string
  targetNumerator?: number
  targetDenominator?: number
  compareNumerator?: number
  compareDenominator?: number
}

export interface SplitFeedback {
  tone: FeedbackTone
  title: string
  body: string
  hint?: string
}
