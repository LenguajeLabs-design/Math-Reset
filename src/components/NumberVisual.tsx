interface NumberVisualProps {
  dividend: number
  divisor: number
  first?: number | null
  second?: number | null
  solved?: boolean
}

export function NumberVisual({ dividend, divisor, first, second, solved }: NumberVisualProps) {
  const hasSplit = typeof first === 'number' && typeof second === 'number'
  const firstWidth = hasSplit ? Math.max(18, (first / dividend) * 100) : 100
  const secondWidth = hasSplit ? Math.max(18, (second / dividend) * 100) : 0

  return (
    <div className={`number-visual ${hasSplit ? 'has-split' : ''} ${solved ? 'solved' : ''}`} aria-label={hasSplit ? `${dividend} split into ${first} and ${second}` : `${dividend} divided by ${divisor}`}>
      <div className="number-visual-head"><span className="visual-kicker">THE WHOLE NUMBER</span><strong>{dividend}</strong></div>
      <div className="number-bar" aria-hidden="true">
        <div className="number-piece piece-a" style={{ width: `${firstWidth}%` }}><span>{hasSplit ? first : dividend}</span></div>
        {hasSplit && <div className="number-piece piece-b" style={{ width: `${secondWidth}%` }}><span>{second}</span></div>}
      </div>
      {hasSplit && <div className="visual-caption"><span>{first} ÷ {divisor}</span><span>{second} ÷ {divisor}</span></div>}
    </div>
  )
}
