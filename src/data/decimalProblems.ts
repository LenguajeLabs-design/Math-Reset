import type { DecimalProblem } from '../types'

export const decimalProblems: DecimalProblem[] = [
  {
    id: 'decimal-half',
    kind: 'decimal',
    title: 'A quiet half',
    prompt: 'What decimal describes the shaded part?',
    answer: '0.5',
    unit: 'of the whole',
    shaded: 50,
  },
  {
    id: 'percent-quarter',
    kind: 'percent',
    title: 'A small corner',
    prompt: 'What percent of the whole is shaded?',
    answer: '25',
    unit: '% of the whole',
    shaded: 25,
  },
  {
    id: 'percent-three-quarters',
    kind: 'percent',
    title: 'Most of the way',
    prompt: 'What percent of the whole is shaded?',
    answer: '75',
    unit: '% of the whole',
    shaded: 75,
  },
]
