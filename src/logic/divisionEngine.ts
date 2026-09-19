import type { Problem, SplitFeedback } from '../types'

export function parseNumber(value: string) {
  const trimmed = value.trim()
  if (!/^\d+$/.test(trimmed)) return null
  return Number(trimmed)
}

export function isFriendlySplit(problem: Problem, first: number | null, second: number | null) {
  return first !== null && second !== null && first > 0 && second > 0 &&
    first + second === problem.dividend && first % problem.divisor === 0 && second % problem.divisor === 0
}

export function isValidSplit(problem: Problem, first: number | null, second: number | null) {
  if (problem.stage !== 4) return isFriendlySplit(problem, first, second)
  return first !== null && second !== null && first > 0 && second > 0 &&
    first + second === problem.dividend && first % problem.divisor === 0 && second % problem.divisor !== 0
}

export function splitFeedback(problem: Problem, first: number | null, second: number | null): SplitFeedback {
  if (first === null || second === null) {
    return { tone: 'neutral', title: 'Take your time.', body: 'Enter two whole numbers, then we can look at how the pieces fit.' }
  }

  if (first + second !== problem.dividend) {
    return {
      tone: 'neutral',
      title: 'Almost.',
      body: `${first} + ${second} = ${first + second}. We need the pieces to add back to ${problem.dividend}.`,
      hint: `Try keeping one piece at ${problem.hintMultiples[1] ?? problem.divisor * 10}.`,
    }
  }

  if (problem.stage === 4) {
    if (first % problem.divisor !== 0 || second % problem.divisor === 0) {
      return {
        tone: 'neutral',
        title: `The pieces add back to ${problem.dividend}.`,
        body: `Start with one large chunk that divides cleanly, then leave a smaller piece where a remainder might appear.`,
        hint: `Try starting with ${problem.hintMultiples[1] ?? problem.divisor * 10}.`,
      }
    }
    return {
      tone: 'positive',
      title: 'That gives us a useful place to begin.',
      body: `${first} divides evenly by ${problem.divisor}. We can explore what happens with the ${second} left over.`,
      hint: 'The smaller piece may have a quotient and a remainder.',
    }
  }

  if (first % problem.divisor !== 0 || second % problem.divisor !== 0) {
    return {
      tone: 'neutral',
      title: `The pieces add back to ${problem.dividend}.`,
      body: `${first} and ${second} are still a little tricky to divide by ${problem.divisor}. Can you find two pieces that are both multiples of ${problem.divisor}?`,
      hint: `Try starting with ${problem.hintMultiples[1] ?? problem.divisor * 10}.`,
    }
  }

  const larger = Math.max(first, second)
  const smaller = Math.min(first, second)
  return {
    tone: 'positive',
    title: 'Nice choice.',
    body: `Both numbers are multiples of ${problem.divisor}. You made one problem into two friendlier ones.`,
    hint: larger > problem.divisor * 10 && smaller < problem.dividend / 2 ? 'You used a large friendly chunk first.' : undefined,
  }
}

export function describeStrategy(first: number, second: number, problem: Problem) {
  const larger = Math.max(first, second)
  const smaller = Math.min(first, second)
  return larger > problem.dividend * 0.6 && smaller < problem.dividend * 0.4
}
