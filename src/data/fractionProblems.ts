import type { FractionProblem } from '../types'

export const fractionProblems: FractionProblem[] = [
  {
    id: 'fraction-half',
    kind: 'build',
    numerator: 1,
    denominator: 2,
    prompt: 'How many equal pieces are shaded?',
  },
  {
    id: 'fraction-third',
    kind: 'build',
    numerator: 2,
    denominator: 3,
    prompt: 'How much of the whole is shaded?',
  },
  {
    id: 'fraction-equivalent',
    kind: 'equivalent',
    numerator: 1,
    denominator: 2,
    targetNumerator: 2,
    targetDenominator: 4,
    prompt: 'Make an equivalent fraction. The amount stays the same.',
  },
  {
    id: 'fraction-compare',
    kind: 'compare',
    numerator: 2,
    denominator: 3,
    compareNumerator: 3,
    compareDenominator: 4,
    prompt: 'Which fraction is larger?',
  },
]
