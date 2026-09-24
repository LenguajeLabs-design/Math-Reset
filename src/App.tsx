import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckIcon, SparkIcon } from './components/Icons'
import { Layout } from './components/Layout'
import { NumberVisual } from './components/NumberVisual'
import { ReflectionCard } from './components/ReflectionCard'
import { divisionProblems } from './data/divisionProblems'
import { fractionProblems } from './data/fractionProblems'
import { describeStrategy, isValidSplit, parseNumber, splitFeedback } from './logic/divisionEngine'
import { loadProgress, saveProgress } from './storage/progressStore'
import type { Confidence, FractionProblem, Problem, ProgressData, Screen } from './types'
import './styles.css'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [progress, setProgress] = useState<ProgressData>(() => loadProgress())
  const [sessionProblems, setSessionProblems] = useState<Problem[]>([])
  const [problemIndex, setProblemIndex] = useState(0)
  const [sessionCount, setSessionCount] = useState(0)

  const updateProgress = (next: ProgressData) => { setProgress(next); saveProgress(next) }

  const startCheckin = () => setScreen('checkin')
  const beginSession = (confidence: Confidence) => {
    const next: ProgressData = { ...progress, confidenceStart: confidence, scaffoldLevel: (confidence === 'difficult' || confidence === 'anxious' ? 2 : 1) as 1 | 2 | 3 }
    updateProgress(next)
    const stageProblems = divisionProblems.filter((problem) => problem.stage === next.currentStage)
    setSessionProblems(stageProblems.slice(0, 7))
    setProblemIndex(0)
    setSessionCount(0)
    setScreen('practice')
  }
  const openProgress = () => setScreen('progress')
  const beginFractions = () => setScreen('fractions')
  const finishSession = () => setScreen('complete')
  const nextProblem = () => {
    if (problemIndex >= sessionProblems.length - 1 || sessionCount >= 6) setScreen('complete')
    else { setProblemIndex((value) => value + 1); setSessionCount((value) => value + 1) }
  }
  const practiceAgain = () => { beginSession(progress.confidenceStart ?? 'rusty') }
  const navigate = (destination: Screen) => {
    if (destination === 'home') setScreen('home')
    else if (destination === 'progress') setScreen('progress')
  }

  return <Layout screen={screen} onNavigate={navigate} showBack={screen !== 'home'} onBack={() => setScreen(screen === 'practice' ? 'home' : 'home')}>
    {screen === 'home' && <Home onStart={startCheckin} onProgress={openProgress} />}
    {screen === 'checkin' && <Checkin onChoose={beginSession} />}
    {screen === 'practice' && sessionProblems[problemIndex] && <Practice key={sessionProblems[problemIndex].id} problem={sessionProblems[problemIndex]} problemNumber={sessionCount + 1} total={sessionProblems.length} progress={progress} onProgressUpdate={updateProgress} onNext={nextProblem} />}
    {screen === 'complete' && <Complete progress={progress} sessionCount={Math.max(sessionCount + 1, 1)} onAgain={practiceAgain} onProgress={openProgress} />}
    {screen === 'progress' && <ProgressView progress={progress} onBack={() => setScreen('home')} onStartFractions={beginFractions} />}
    {screen === 'fractions' && <FractionPractice progress={progress} onProgressUpdate={updateProgress} onExit={openProgress} />}
  </Layout>
}

function Home({ onStart, onProgress }: { onStart: () => void; onProgress: () => void }) {
  return <div className="home-page">
    <div className="home-intro">
      <div className="overline"><span className="overline-line" /> MATH, RESET <span className="overline-line" /></div>
      <h1>See the math.<br /><em>Build the confidence.</em></h1>
      <p className="home-lede">A calm place to learn how numbers fit together — one friendly step at a time.</p>
      <div className="home-actions"><button className="button-primary" onClick={onStart}>Start division <ArrowRight /></button><button className="button-text" onClick={onProgress}>View your progress <ArrowRight /></button></div>
      <p className="home-reassurance"><span>○</span> No timers &nbsp;&nbsp; <span>○</span> No scores &nbsp;&nbsp; <span>○</span> No memorized steps</p>
    </div>
    <div className="home-visual" aria-hidden="true">
      <div className="orbit orbit-one" /><div className="orbit orbit-two" />
      <div className="visual-card visual-card-main"><span className="visual-card-label">ONE PROBLEM</span><strong>196 ÷ 7</strong><div className="mini-equation"><span>140</span><b>+</b><span>56</span></div><div className="mini-bar"><i /><i /></div><small>made of friendlier pieces</small></div>
      <div className="visual-note note-top"><SparkIcon /> Start with what you know.</div>
      <div className="visual-note note-bottom">A number can be made lighter.</div>
    </div>
    <div className="home-proof"><span>01</span><div><strong>One idea to carry with you</strong><p>You do not have to solve the whole problem at once.</p></div></div>
  </div>
}

function Checkin({ onChoose }: { onChoose: (confidence: Confidence) => void }) {
  const options: { label: string; value: Confidence; copy: string }[] = [
    { label: 'Comfortable', value: 'comfortable', copy: 'I can usually find a way in.' },
    { label: 'A little rusty', value: 'rusty', copy: 'I could use a gentle warm-up.' },
    { label: 'Difficult', value: 'difficult', copy: 'I want to take this slowly.' },
    { label: '😬', value: 'anxious', copy: 'Let’s make this feel less threatening.' },
  ]
  return <div className="checkin-page">
    <div className="checkin-heading"><span className="section-label">BEFORE WE BEGIN</span><h1>How does division<br /><em>feel right now?</em></h1><p>This is just a starting point, not a test. We’ll use your answer to choose how much support to show.</p></div>
    <div className="checkin-grid">{options.map((option, index) => <button className="checkin-option" key={option.value} onClick={() => onChoose(option.value)}><span className="option-index">0{index + 1}</span><strong>{option.label}</strong><span>{option.copy}</span><ArrowRight /></button>)}</div>
    <p className="quiet-note"><span>✦</span> You can change the level of support as you go.</p>
  </div>
}

interface PracticeProps { problem: Problem; problemNumber: number; total: number; progress: ProgressData; onProgressUpdate: (progress: ProgressData) => void; onNext: () => void }
function Practice({ problem, problemNumber, total, progress, onProgressUpdate, onNext }: PracticeProps) {
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [feedback, setFeedback] = useState<ReturnType<typeof splitFeedback> | null>(null)
  const [split, setSplit] = useState<[number, number] | null>(null)
  const [step, setStep] = useState<'split' | 'first' | 'second' | 'remainder' | 'done'>('split')
  const [firstAnswer, setFirstAnswer] = useState('')
  const [secondAnswer, setSecondAnswer] = useState('')
  const [remainderQuotientAnswer, setRemainderQuotientAnswer] = useState('')
  const [remainderAnswer, setRemainderAnswer] = useState('')
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null)
  const [hintShown, setHintShown] = useState(false)
  const [splitAttempts, setSplitAttempts] = useState(0)
  const [reflection, setReflection] = useState<string>()

  const firstNum = parseNumber(first); const secondNum = parseNumber(second)
  const firstQuotient = split ? split[0] / problem.divisor : 0
  const secondQuotient = split ? Math.floor(split[1] / problem.divisor) : 0
  const remainderValue = split ? split[1] % problem.divisor : 0
  const completed = step === 'done'

  const submitSplit = () => {
    const result = splitFeedback(problem, firstNum, secondNum)
    setFeedback(result)
    if (isValidSplit(problem, firstNum, secondNum)) {
      const values: [number, number] = [firstNum as number, secondNum as number]
      setSplit(values); setStep('first')
      const next = { ...progress, independentSolutions: progress.independentSolutions + (hintShown ? 0 : 1), correctStreak: progress.correctStreak + 1, preferredPatterns: { ...progress.preferredPatterns, largeFriendlyChunk: progress.preferredPatterns.largeFriendlyChunk + (describeStrategy(values[0], values[1], problem) ? 1 : 0) } }
      if (next.correctStreak >= 3 && next.scaffoldLevel > 1) next.scaffoldLevel = (next.scaffoldLevel - 1) as 1 | 2 | 3
      if (next.correctStreak >= 3 && next.currentStage < 4) next.currentStage = (next.currentStage + 1) as 1 | 2 | 3 | 4
      onProgressUpdate(next)
    } else {
      const nextAttempts = splitAttempts + 1
      setSplitAttempts(nextAttempts)
      const next = { ...progress, correctStreak: 0, scaffoldLevel: nextAttempts >= 2 && progress.scaffoldLevel < 3 ? (progress.scaffoldLevel + 1) as 1 | 2 | 3 : progress.scaffoldLevel }
      onProgressUpdate(next)
    }
  }
  const useHint = () => { setHintShown(true); onProgressUpdate({ ...progress, hintsUsed: progress.hintsUsed + 1, correctStreak: 0 }); }
  const submitAnswer = (which: 'first' | 'second') => {
    const answer = parseNumber(which === 'first' ? firstAnswer : secondAnswer)
    const expected = which === 'first' ? firstQuotient : secondQuotient
    if (answer === expected) { setAnswerFeedback(null); setStep(which === 'first' ? (problem.stage === 4 ? 'remainder' : 'second') : 'done'); if (which === 'second') { onProgressUpdate({ ...progress, problemsCompleted: progress.problemsCompleted + 1, recentProblems: [...progress.recentProblems.slice(-9), problem.id] }); } }
    else setAnswerFeedback('Try using the chunk and the divisor as a multiplication fact. It may be easier to ask: what times ' + problem.divisor + ' makes ' + (which === 'first' ? split?.[0] : split?.[1]) + '?')
  }
  const submitRemainder = () => {
    const quotient = parseNumber(remainderQuotientAnswer)
    const remainder = parseNumber(remainderAnswer)
    if (quotient === secondQuotient && remainder === remainderValue) {
      setAnswerFeedback(null)
      setStep('done')
      onProgressUpdate({ ...progress, problemsCompleted: progress.problemsCompleted + 1, remaindersExplored: progress.remaindersExplored + 1, recentProblems: [...progress.recentProblems.slice(-9), problem.id] })
    } else {
      setAnswerFeedback(`Ask two questions: how many whole groups of ${problem.divisor} fit into ${split?.[1]}? What is left after those groups?`)
    }
  }
  const chooseReflection = (value: string) => { setReflection(value); onProgressUpdate({ ...progress, reflectionResponses: [...progress.reflectionResponses, value] }) }

  const guided = progress.scaffoldLevel >= 2
  return <div className="practice-page">
    <div className="practice-topline"><div><span className="section-label">DIVISION / {problem.stage === 4 ? 'REMAINDERS' : problem.stage === 3 ? 'FLEXIBLE CHUNKS' : 'FRIENDLY NUMBERS'}</span><span className="problem-count">{String(problemNumber).padStart(2, '0')} / {String(total).padStart(2, '0')}</span></div><div className="practice-progress"><i style={{ width: `${(problemNumber / total) * 100}%` }} /></div></div>
    <div className="practice-layout">
      <section className="problem-panel">
        <div className="problem-heading"><span className="section-label">YOUR PROBLEM</span><div className="equation-large"><span>{problem.dividend}</span><b>÷</b><span>{problem.divisor}</span></div></div>
        {!completed && step === 'split' && <>
          <h1>{problem.stage === 4 ? <>Can you break <em>{problem.dividend}</em> into a friendly chunk and a smaller piece?</> : <>Can you break <em>{problem.dividend}</em> into two numbers that are easier to divide by {problem.divisor}?</>}</h1>
          <p className="supporting-copy">{problem.stage === 4 ? <>Start with a large multiple of {problem.divisor}. The smaller piece may leave a remainder.</> : <>Look for two friendly multiples. There may be more than one good answer.</>}</p>
          {guided && <div className="guided-tip"><span className="tip-icon">✦</span><div><strong>One way in</strong><p>{problem.divisor} × {Math.round(problem.hintMultiples[1] / problem.divisor)} = {problem.hintMultiples[1]}. You could start there.</p></div></div>}
          <NumberVisual dividend={problem.dividend} divisor={problem.divisor} />
          <div className="split-form"><label><span className="sr-only">First part</span><input autoFocus inputMode="numeric" value={first} onChange={(event) => setFirst(event.target.value)} placeholder="140" /></label><span className="plus-sign">+</span><label><span className="sr-only">Second part</span><input inputMode="numeric" value={second} onChange={(event) => setSecond(event.target.value)} placeholder="56" /></label></div>
          <button className="button-primary full-width" onClick={submitSplit}>Check my split <ArrowRight /></button>
          {feedback && <div className={`feedback-card ${feedback.tone}`}><div className="feedback-heading"><span>{feedback.tone === 'positive' ? <CheckIcon /> : '·'}</span><strong>{feedback.title}</strong></div><p>{feedback.body}</p>{feedback.hint && <p className="feedback-hint">{feedback.hint}</p>}</div>}
          <div className="practice-tools"><button className="button-text" onClick={useHint}>Need a small hint? <ArrowRight /></button><button className="button-text muted" onClick={() => { setFirst(String(problem.suggestedSplits[0][0])); setSecond(String(problem.suggestedSplits[0][1])) }}>Show an example <ArrowRight /></button></div>
        </>}
        {!completed && step !== 'split' && <>
          <div className="success-intro"><span className="success-badge"><CheckIcon /></span><div><span className="section-label">THE SPLIT WORKS</span><h1>Now let’s solve<br /><em>one piece at a time.</em></h1></div></div>
          <NumberVisual dividend={problem.dividend} divisor={problem.divisor} first={split?.[0]} second={split?.[1]} />
          {step === 'first' && <ChunkStep chunk={split![0]} divisor={problem.divisor} answer={firstAnswer} setAnswer={setFirstAnswer} onSubmit={() => submitAnswer('first')} feedback={answerFeedback} label="Start with the first chunk." />}
          {step === 'second' && <ChunkStep chunk={split![1]} divisor={problem.divisor} answer={secondAnswer} setAnswer={setSecondAnswer} onSubmit={() => submitAnswer('second')} feedback={answerFeedback} label="Now solve the smaller piece." />}
          {step === 'remainder' && <RemainderStep chunk={split![1]} divisor={problem.divisor} quotientAnswer={remainderQuotientAnswer} setQuotientAnswer={setRemainderQuotientAnswer} remainderAnswer={remainderAnswer} setRemainderAnswer={setRemainderAnswer} onSubmit={submitRemainder} feedback={answerFeedback} />}
        </>}
        {step === 'done' && <div className="recombine-card"><span className="section-label">PUT THE PIECES BACK TOGETHER</span>{problem.stage === 4 ? <div className="recombine-equation remainder-equation"><span>{firstQuotient}</span><b>+</b><span>{secondQuotient}</span><b>=</b><strong>{firstQuotient + secondQuotient}</strong><small>remainder {remainderValue}</small></div> : <div className="recombine-equation"><span>{firstQuotient}</span><b>+</b><span>{secondQuotient}</span><b>=</b><strong>{problem.dividend / problem.divisor}</strong></div>}<p>{problem.stage === 4 ? <>You found the whole groups first, then named what was left over.</> : <>You turned one difficult problem into two easier ones.</>}</p><button className="button-primary" onClick={onNext}>Next problem <ArrowRight /></button></div>}
      </section>
      <aside className="strategy-panel"><span className="section-label">THE IDEA</span><h2>Do not solve<br />the whole thing<br /><em>at once.</em></h2><div className="strategy-flow"><div><span>01</span><strong>Find friendly multiples</strong></div><i>↓</i><div><span>02</span><strong>Break the number apart</strong></div><i>↓</i><div><span>03</span><strong>Put the pieces back</strong></div></div><div className="strategy-quote">“A hard problem can be made of easier ones.”</div></aside>
    </div>
    {(problemNumber === 4 || (completed && problemNumber % 4 === 0)) && <ReflectionCard onSelect={chooseReflection} selected={reflection} />}
  </div>
}

function ChunkStep({ chunk, divisor, answer, setAnswer, onSubmit, feedback, label }: { chunk: number; divisor: number; answer: string; setAnswer: (value: string) => void; onSubmit: () => void; feedback: string | null; label: string }) {
  return <div className="chunk-step"><span className="section-label">A FRIENDLY FACT</span><h2>{label}</h2><div className="chunk-equation"><span>{chunk}</span><b>÷</b><span>{divisor}</span><b>=</b><input autoFocus inputMode="numeric" aria-label={`${chunk} divided by ${divisor}`} value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') onSubmit() }} /></div><button className="button-primary" onClick={onSubmit}>Check this piece <ArrowRight /></button>{feedback && <p className="answer-feedback">{feedback}</p>}</div>
}

function RemainderStep({ chunk, divisor, quotientAnswer, setQuotientAnswer, remainderAnswer, setRemainderAnswer, onSubmit, feedback }: { chunk: number; divisor: number; quotientAnswer: string; setQuotientAnswer: (value: string) => void; remainderAnswer: string; setRemainderAnswer: (value: string) => void; onSubmit: () => void; feedback: string | null }) {
  return <div className="chunk-step remainder-step"><span className="section-label">THE LEFTOVER PIECE</span><h2>How many whole groups fit?</h2><p className="supporting-copy">Then notice what is left over.</p><div className="remainder-equation-input"><span>{chunk}</span><b>÷</b><span>{divisor}</span><b>=</b><input autoFocus inputMode="numeric" aria-label="Whole groups" value={quotientAnswer} onChange={(event) => setQuotientAnswer(event.target.value)} placeholder="?" /><span className="remainder-label">remainder</span><input inputMode="numeric" aria-label="Remainder" value={remainderAnswer} onChange={(event) => setRemainderAnswer(event.target.value)} placeholder="?" /></div><button className="button-primary" onClick={onSubmit}>Check the remainder <ArrowRight /></button>{feedback && <p className="answer-feedback">{feedback}</p>}</div>
}

function Complete({ progress, sessionCount, onAgain, onProgress }: { progress: ProgressData; sessionCount: number; onAgain: () => void; onProgress: () => void }) {
  const strategyMessage = progress.preferredPatterns.largeFriendlyChunk > 1 ? 'You often chose a large friendly multiple first, then solved the smaller piece.' : 'You practiced looking for numbers that divide cleanly.'
  return <div className="complete-page"><div className="complete-mark"><CheckIcon /></div><span className="section-label">SESSION COMPLETE</span><h1>Nice work.<br /><em>That was enough for today.</em></h1><p className="complete-lede">{strategyMessage}</p><div className="session-summary"><div><span className="summary-number">{Math.max(progress.problemsCompleted, sessionCount)}</span><span>problems<br />explored</span></div><div><span className="summary-number">{progress.independentSolutions}</span><span>independent<br />solutions</span></div><div><span className="summary-number">{progress.hintsUsed}</span><span>hints<br />used</span></div></div><div className="complete-actions"><button className="button-primary" onClick={onAgain}>Practice again <ArrowRight /></button><button className="button-text" onClick={onProgress}>See your progress <ArrowRight /></button></div></div>
}

function ProgressView({ progress, onBack, onStartFractions }: { progress: ProgressData; onBack: () => void; onStartFractions: () => void }) {
  const concepts = [
    { label: 'Connect division and multiplication', done: progress.problemsCompleted > 0 },
    { label: 'Find friendly multiples', done: progress.problemsCompleted >= 2 },
    { label: 'Break numbers into easier chunks', done: progress.problemsCompleted >= 4 },
    { label: 'Work with remainders', done: progress.remaindersExplored > 0 },
  ]
  return <div className="progress-page"><div className="progress-heading"><div><span className="section-label">YOUR PROGRESS</span><h1>A little more<br /><em>understanding.</em></h1></div><button className="button-text" onClick={onBack}><ArrowLeft /> Back to home</button></div><LearningPath progress={progress} /><NextLevels progress={progress} onStart={onStartFractions} /><div className="progress-overview"><div className="progress-card progress-card-large"><span className="section-label">DIVISION</span><h2>Seeing numbers<br />as <em>friendly pieces.</em></h2><div className="concept-list">{concepts.map((concept) => <div key={concept.label} className={concept.done ? 'done' : ''}><span>{concept.done ? <CheckIcon /> : '○'}</span><strong>{concept.label}</strong></div>)}</div></div><div className="progress-stat-stack"><div className="stat-card"><span className="section-label">PROBLEMS EXPLORED</span><strong>{progress.problemsCompleted}</strong><span>one at a time</span></div><div className="stat-card"><span className="section-label">INDEPENDENT SOLUTIONS</span><strong>{progress.independentSolutions}</strong><span>your way in</span></div><div className="stat-card"><span className="section-label">HINTS USED</span><strong>{progress.hintsUsed}</strong><span>support when useful</span></div></div></div><div className="progress-note"><span>✦</span><p><strong>Your approach is part of the learning.</strong><br />We’re keeping track of ideas that help you — not just answers that are right.</p></div></div>
}

function LearningPath({ progress }: { progress: ProgressData }) {
  const path = [
    { label: 'Connect', detail: 'Division and multiplication', done: progress.problemsCompleted > 0 },
    { label: 'Find', detail: 'Friendly multiples', done: progress.problemsCompleted >= 2 },
    { label: 'Break apart', detail: 'A difficult number', done: progress.problemsCompleted >= 4 },
    { label: 'Choose your way', detail: 'More than one good split', done: progress.currentStage >= 3 && progress.problemsCompleted >= 6 },
    { label: 'Remainders', detail: 'What does not divide evenly', done: progress.remaindersExplored > 0, upcoming: progress.currentStage < 4 },
    { label: 'Fractions', detail: 'Equal pieces of a whole', done: progress.fractionProgress.problemsCompleted > 0, upcoming: progress.remaindersExplored === 0 },
  ]
  const currentIndex = path.findIndex((node) => !node.done && !node.upcoming)

  return <section className="learning-path" aria-labelledby="learning-path-title">
    <div className="learning-path-heading"><div><span className="section-label">THE PATH AHEAD</span><h2 id="learning-path-title">From facts to <em>freedom.</em></h2></div><span className="path-caption">One steady step at a time.</span></div>
    <ol className="path-track">
      {path.map((node, index) => { const active = index === currentIndex; return <li key={node.label} className={`${node.done ? 'done' : ''} ${active ? 'active' : ''} ${node.upcoming ? 'upcoming' : ''}`}><div className="path-node" aria-hidden="true">{node.done ? <CheckIcon /> : String(index + 1).padStart(2, '0')}</div><div className="path-copy"><strong>{node.label}</strong><span>{node.detail}</span>{active && <small>you are here</small>}{node.upcoming && <small>up next</small>}</div></li> })}
    </ol>
  </section>
}

function NextLevels({ progress, onStart }: { progress: ProgressData; onStart: () => void }) {
  const levels = [
    { number: '06', title: 'Fractions', detail: 'See parts as equal pieces.' },
    { number: '07', title: 'Decimals & percent', detail: 'Move between parts, wholes, and proportion.' },
    { number: '08', title: 'Early algebra', detail: 'Notice the unknown and find what balances.' },
  ]

  return <section className="next-levels" aria-labelledby="next-levels-title"><div className="next-levels-heading"><div><span className="section-label">AFTER DIVISION</span><h2 id="next-levels-title">The crossing <em>continues.</em></h2></div><span className="path-caption">Future modules, held gently.</span></div><div className="next-level-grid">{levels.map((level, index) => <article className={`next-level-card ${index === 0 ? 'next-level-card-ready' : ''}`} key={level.title}><span className="next-level-number">{level.number}</span><div><h3>{level.title}</h3><p>{level.detail}</p></div>{index === 0 ? <><span className="next-level-state">{progress.fractionProgress.problemsCompleted > 0 ? 'EXPLORED' : 'READY'}</span><button className="button-text next-level-action" onClick={onStart}>{progress.fractionProgress.problemsCompleted > 0 ? 'Review fraction bars' : 'Begin with fraction bars'} <ArrowRight /></button></> : <span className="next-level-state">UPCOMING</span>}</article>)}</div></section>
}

function FractionPractice({ progress, onProgressUpdate, onExit }: { progress: ProgressData; onProgressUpdate: (progress: ProgressData) => void; onExit: () => void }) {
  const [problemIndex, setProblemIndex] = useState(0)
  const problem = fractionProblems[problemIndex]
  const [answer, setAnswer] = useState('')
  const [secondAnswer, setSecondAnswer] = useState('')
  const [choice, setChoice] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [complete, setComplete] = useState(false)

  const resetProblem = (nextIndex: number) => {
    setProblemIndex(nextIndex)
    setAnswer('')
    setSecondAnswer('')
    setChoice(null)
    setFeedback(null)
  }

  const submit = () => {
    const correct = problem.kind === 'build'
      ? Number(answer) === problem.numerator
      : problem.kind === 'equivalent'
        ? Number(answer) === problem.targetNumerator && Number(secondAnswer) === problem.targetDenominator
        : choice === 'right'
    if (!correct) {
      setFeedback(problem.kind === 'compare' ? 'Look at the bars first. Which one covers more of the same whole?' : 'Trace the shaded pieces, then name how many pieces are shaded out of the whole.')
      return
    }
    const nextFractionProgress = {
      ...progress.fractionProgress,
      problemsCompleted: progress.fractionProgress.problemsCompleted + 1,
      correctStreak: progress.fractionProgress.correctStreak + 1,
      equivalentFractions: progress.fractionProgress.equivalentFractions + (problem.kind === 'equivalent' ? 1 : 0),
      comparisons: progress.fractionProgress.comparisons + (problem.kind === 'compare' ? 1 : 0),
    }
    onProgressUpdate({ ...progress, fractionProgress: nextFractionProgress })
    if (problemIndex === fractionProblems.length - 1) setComplete(true)
    else setFeedback('That’s it. The picture and the fraction say the same thing.')
  }

  if (complete) return <div className="fraction-complete"><span className="complete-mark"><CheckIcon /></span><span className="section-label">FRACTIONS / FIRST CROSSING</span><h1>You found the<br /><em>parts of the whole.</em></h1><p>You used a fraction bar to see equal pieces, build an equivalent fraction, and compare amounts.</p><div className="fraction-summary"><strong>{progress.fractionProgress.problemsCompleted}</strong><span>fraction ideas explored</span></div><button className="button-primary" onClick={onExit}>Back to your path <ArrowRight /></button></div>

  return <div className="fraction-page"><div className="practice-topline"><div><span className="section-label">FRACTIONS / FRACTION BARS</span><span className="problem-count">{String(problemIndex + 1).padStart(2, '0')} / {String(fractionProblems.length).padStart(2, '0')}</span></div><div className="practice-progress"><i style={{ width: `${((problemIndex + 1) / fractionProblems.length) * 100}%` }} /></div></div><div className="fraction-intro"><button className="button-text" onClick={onExit}><ArrowLeft /> Back to your path</button><span className="section-label">THE NEXT BRIDGE</span><h1>A fraction is a whole<br /><em>seen in equal pieces.</em></h1><p>Let the picture carry some of the thinking. Count the pieces, then name the amount.</p></div><section className="fraction-card"><div className="fraction-card-kicker"><span className="section-label">{problem.kind === 'build' ? 'NAME WHAT YOU SEE' : problem.kind === 'equivalent' ? 'KEEP THE AMOUNT' : 'COMPARE THE WHOLES'}</span><span className="fraction-step-note">{problemIndex + 1} of {fractionProblems.length}</span></div><h2>{problem.prompt}</h2>{problem.kind === 'build' && <><FractionBar numerator={problem.numerator} denominator={problem.denominator} showShadedCount={false} /><div className="fraction-input-line"><input autoFocus inputMode="numeric" aria-label="Shaded pieces" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="?" /><span>/ {problem.denominator}</span></div><button className="button-primary" onClick={submit}>Name this fraction <ArrowRight /></button></>}{problem.kind === 'equivalent' && <><div className="fraction-equivalence"><FractionBar numerator={problem.numerator} denominator={problem.denominator} /><span>=</span><div className="fraction-stack-input"><input autoFocus inputMode="numeric" aria-label="Equivalent numerator" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="?" /><i /><input inputMode="numeric" aria-label="Equivalent denominator" value={secondAnswer} onChange={(event) => setSecondAnswer(event.target.value)} placeholder="?" /></div></div><button className="button-primary" onClick={submit}>Make the same amount <ArrowRight /></button></>}{problem.kind === 'compare' && <><div className="fraction-compare"><FractionBar numerator={problem.numerator} denominator={problem.denominator} /><span className="compare-versus">or</span><FractionBar numerator={problem.compareNumerator!} denominator={problem.compareDenominator!} /></div><div className="compare-actions"><button className={choice === 'left' ? 'fraction-choice selected' : 'fraction-choice'} onClick={() => setChoice('left')}>Choose <strong>{problem.numerator}/{problem.denominator}</strong></button><button className={choice === 'right' ? 'fraction-choice selected' : 'fraction-choice'} onClick={() => setChoice('right')}>Choose <strong>{problem.compareNumerator}/{problem.compareDenominator}</strong></button></div><button className="button-primary" onClick={submit}>Check the larger piece <ArrowRight /></button></>}{feedback && <div className="fraction-feedback"><CheckIcon /><p>{feedback}</p>{feedback.startsWith('That') && <button className="button-text" onClick={() => resetProblem(problemIndex + 1)}>Next fraction <ArrowRight /></button>}</div>}</section></div>
}

function FractionBar({ numerator, denominator, showShadedCount = true }: { numerator: number; denominator: number; showShadedCount?: boolean }) {
  const visualLabel = showShadedCount ? `${numerator} of ${denominator} equal pieces shaded` : `Fraction bar split into ${denominator} equal pieces`
  return <div className="fraction-bar-wrap"><div className="fraction-bar" role="img" aria-label={visualLabel}>{Array.from({ length: denominator }, (_, index) => <span className={index < numerator ? 'shaded' : ''} key={index} />)}</div><div className={`fraction-bar-label ${showShadedCount ? '' : 'single'}`}>{showShadedCount && <span>{numerator} shaded {numerator === 1 ? 'piece' : 'pieces'}</span>}<span>{denominator} equal pieces total</span></div></div>
}

export default App
