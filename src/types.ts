export type Confidence = 'comfortable' | 'rusty' | 'difficult' | 'anxious'
export type Screen = 'home' | 'checkin' | 'practice' | 'complete' | 'progress'
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
}

export interface SplitFeedback {
  tone: FeedbackTone
  title: string
  body: string
  hint?: string
}
