import type { Problem } from '../types'

export const divisionProblems: Problem[] = [
  { id: 'division-24-6', dividend: 24, divisor: 6, stage: 1, suggestedSplits: [[12, 12], [18, 6]], hintMultiples: [6, 12, 18], concept: 'relationship' },
  { id: 'division-35-5', dividend: 35, divisor: 5, stage: 1, suggestedSplits: [[25, 10], [20, 15]], hintMultiples: [5, 10, 25], concept: 'relationship' },
  { id: 'division-42-6', dividend: 42, divisor: 6, stage: 1, suggestedSplits: [[36, 6], [24, 18]], hintMultiples: [6, 12, 36], concept: 'relationship' },
  { id: 'division-54-6', dividend: 54, divisor: 6, stage: 1, suggestedSplits: [[48, 6], [30, 24]], hintMultiples: [6, 30, 48], concept: 'relationship' },
  { id: 'division-72-8', dividend: 72, divisor: 8, stage: 1, suggestedSplits: [[64, 8], [40, 32]], hintMultiples: [8, 40, 64], concept: 'relationship' },
  { id: 'division-84-4', dividend: 84, divisor: 4, stage: 2, suggestedSplits: [[80, 4], [40, 44]], hintMultiples: [4, 20, 80], concept: 'decomposition' },
  { id: 'division-96-6', dividend: 96, divisor: 6, stage: 2, suggestedSplits: [[60, 36], [84, 12]], hintMultiples: [6, 60, 84], concept: 'decomposition' },
  { id: 'division-132-6', dividend: 132, divisor: 6, stage: 2, suggestedSplits: [[120, 12], [60, 72]], hintMultiples: [6, 60, 120], concept: 'decomposition' },
  { id: 'division-156-3', dividend: 156, divisor: 3, stage: 2, suggestedSplits: [[150, 6], [120, 36]], hintMultiples: [3, 150, 120], concept: 'decomposition' },
  { id: 'division-168-4', dividend: 168, divisor: 4, stage: 2, suggestedSplits: [[160, 8], [80, 88]], hintMultiples: [4, 80, 160], concept: 'decomposition' },
  { id: 'division-144-6', dividend: 144, divisor: 6, stage: 3, suggestedSplits: [[120, 24], [60, 84]], hintMultiples: [6, 120, 144], concept: 'flexibility' },
  { id: 'division-175-5', dividend: 175, divisor: 5, stage: 3, suggestedSplits: [[150, 25], [100, 75]], hintMultiples: [5, 100, 150], concept: 'flexibility' },
  { id: 'division-196-7', dividend: 196, divisor: 7, stage: 3, suggestedSplits: [[140, 56], [168, 28], [70, 126]], hintMultiples: [70, 140, 196], concept: 'flexibility' },
  { id: 'division-252-7', dividend: 252, divisor: 7, stage: 3, suggestedSplits: [[210, 42], [140, 112], [70, 182]], hintMultiples: [70, 140, 210], concept: 'flexibility' },
  { id: 'division-324-6', dividend: 324, divisor: 6, stage: 3, suggestedSplits: [[300, 24], [240, 84], [180, 144]], hintMultiples: [60, 240, 300], concept: 'flexibility' },
  { id: 'division-432-8', dividend: 432, divisor: 8, stage: 3, suggestedSplits: [[400, 32], [320, 112], [240, 192]], hintMultiples: [80, 320, 400], concept: 'flexibility' },
  { id: 'division-468-9', dividend: 468, divisor: 9, stage: 3, suggestedSplits: [[450, 18], [360, 108], [270, 198]], hintMultiples: [90, 360, 450], concept: 'flexibility' },
  { id: 'division-672-8', dividend: 672, divisor: 8, stage: 3, suggestedSplits: [[640, 32], [560, 112], [400, 272]], hintMultiples: [80, 560, 640], concept: 'flexibility' },
  { id: 'remainder-650-8', dividend: 650, divisor: 8, stage: 4, suggestedSplits: [[640, 10], [600, 50]], hintMultiples: [80, 640], concept: 'remainders' },
  { id: 'remainder-194-6', dividend: 194, divisor: 6, stage: 4, suggestedSplits: [[180, 14], [120, 74]], hintMultiples: [30, 180], concept: 'remainders' },
  { id: 'remainder-275-8', dividend: 275, divisor: 8, stage: 4, suggestedSplits: [[272, 3], [240, 35]], hintMultiples: [40, 272], concept: 'remainders' },
]

export function problemsForStage(stage: 1 | 2 | 3) {
  return divisionProblems.filter((problem) => problem.stage <= stage)
}
