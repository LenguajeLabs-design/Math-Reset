import type { WordProblem } from '../types'

export const wordProblems: WordProblem[] = [
  {
    id: 'berries-share',
    kind: 'share',
    title: 'A fair share',
    story: 'There are 18 berries for 3 friends. Everyone gets the same amount.',
    prompt: 'How many berries does each friend get?',
    answer: '6',
    unit: 'berries each',
    total: 18,
    groups: 3,
  },
  {
    id: 'stones-groups',
    kind: 'group',
    title: 'A path of stones',
    story: 'A path has 24 stones. You place them in 6 equal rows.',
    prompt: 'How many stones are in each row?',
    answer: '4',
    unit: 'stones per row',
    total: 24,
    groups: 6,
  },
  {
    id: 'picnic-pizza',
    kind: 'fraction',
    title: 'A picnic pizza',
    story: 'A pizza is cut into 4 equal slices. You eat 3 slices.',
    prompt: 'What fraction of the pizza did you eat?',
    answer: '3/4',
    unit: 'of the pizza',
    numerator: 3,
    denominator: 4,
  },
]
